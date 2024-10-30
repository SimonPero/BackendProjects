import express, { Request, Response, NextFunction } from "express";
import http from "http";
import FileManager from "./FileManager";
import CachingManager from "./CachingManager";
import { CacheEntry } from "../utils/types/CacheEntry";

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
      console.log("xddd");
      const cachedData = await fileManager.readFile(fileName);
      if (typeof cachedData !== "boolean") {
        console.log("douuu");
        const cleanedCache = await cachingManager.batchEvict(cachedData);
        console.log(cleanedCache);
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
        // Rebuild the cached response
        const { body, headers, mimeType } = foundEntry.res;
        res.set(headers); // Set headers
        res.type(mimeType); // Set MIME type
        return res.send(body); // Send the cached body
      }
  
      // If no cache hit, forward the request
      const forwardedReqResult = await fetch(`${orgServerUrl}${req.url}`);
      const contentType = forwardedReqResult.headers.get("content-type");
  
      if (!contentType) {
        return res.sendStatus(400);
      }
  
      const responseMimeType = contentType.split(";")[0];
      const updatedCache = await cachingManager.addToCache(
        cachedData,
        req.method,
        proxyUrl + req.url,
        forwardedReqResult,
        responseMimeType
      );
  
      await fileManager.writeFile(fileName, updatedCache);
      res.type(responseMimeType);
      res.set(Object.fromEntries(forwardedReqResult.headers.entries()));
      res.send(await forwardedReqResult.text());
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
