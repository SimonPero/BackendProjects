import express, { Request } from "express";
import http from "http";
import FileManager from "./FileManager";
import CachingManager from "./CachingManager";

export default async function startProxyServer(
  appPort: number,
  orgServerUrl: string,
  fileName: string
) {
  const app = express();
  const cachingManager = new CachingManager();
  const fileManager = new FileManager();

  const LOOP_TIME = 60 * 60 * 1000;
  const cleanup = async () => {
    try {
      const cachedData = await fileManager.readFile(fileName);
      if (typeof cachedData !== "boolean") {
        const cleanedCache = await cachingManager.batchEvict(cachedData);
        await fileManager.writeFile(fileName, cleanedCache);
        console.log("Cache cleanup completed");
      }
    } catch (error) {
      console.error("Error during cache cleanup:", error);
    }
  };

  const cleanupInterval = setInterval(cleanup, LOOP_TIME);
  process.on("SIGTERM", () => {
    clearInterval(cleanupInterval);
    process.exit(0);
  });

  process.on("SIGINT", () => {
    clearInterval(cleanupInterval);
    process.exit(0);
  });

  app.use("/", async (req: Request, res: any) => {
    try {
      const proxyUrl = `http://localhost:${appPort}`;
      const cachedData = await fileManager.readFile(fileName);
  
      if (typeof cachedData === "boolean") {
        return res.send("Error: No cache data found.");
      }
  
      const foundEntry = await cachingManager.getCacheEntry(
        cachedData,
        req.method,
        proxyUrl + req.url
      );
  
      if (foundEntry) {
        const { body, headers, mimeType } = foundEntry.res;
        // Remove content-encoding header since we're sending uncompressed data
        const modifiedHeaders = { ...headers };
        delete modifiedHeaders['content-encoding'];
        
        res.set(modifiedHeaders);
        res.type(mimeType);
        
        if (mimeType === 'application/json') {
          return res.json(JSON.parse(body));
        }
        return res.send(body);
      }
  
      const forwardedReqResult = await fetch(`${orgServerUrl}${req.url}`);
      const contentType = forwardedReqResult.headers.get("content-type");
  
      if (!contentType) {
        return res.sendStatus(400);
      }
  
      const responseMimeType = contentType.split(";")[0];
      
      let responseBody;
      if (responseMimeType === 'application/json') {
        const jsonData = await forwardedReqResult.json();
        responseBody = JSON.stringify(jsonData);
      } else {
        responseBody = await forwardedReqResult.text();
      }
  
      // Get headers but remove content-encoding since we're storing decoded content
      const headers = Object.fromEntries(forwardedReqResult.headers.entries());
      delete headers['content-encoding'];
  
      const responseForCache = new Response(responseBody, {
        status: forwardedReqResult.status,
        statusText: forwardedReqResult.statusText,
        headers: headers
      });
  
      const updatedCache = await cachingManager.addToCache(
        cachedData,
        req.method,
        proxyUrl + req.url,
        responseForCache,
        responseMimeType
      );
  
      await fileManager.writeFile(fileName, updatedCache);
      
      res.type(responseMimeType);
      res.set(headers);
      
      if (responseMimeType === 'application/json') {
        return res.json(JSON.parse(responseBody));
      }
      return res.send(responseBody);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  const server = http.createServer(app);

  server.listen(appPort, async () => {
    try {
      console.log(`Servidor escuchando http://localhost:${appPort}`);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
}
