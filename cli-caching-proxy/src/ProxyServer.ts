import express from "express";
import { Request, Response } from "express";
export default async function startProxyServer(appPort: number, url: string) {
  const app = express();
  const port = appPort;

  app.get("/", async (req: Request, res: Response) => {
    res.json({ dou: "douuuuuuuu" });
  });

  app.listen(port, async () => {
    try {
      console.log(`Servidor escuchando http://localhost:${port}`);
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });
}
