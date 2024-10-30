import fs from "node:fs/promises";
import { CacheEntry } from "../utils/types/CacheEntry";
export default class FileManager {
  private directory = "caches/";

  private getFilePath(fileName: string): string {
    return `${this.directory}${fileName}.json`;
  }

  static urlSplitter(url: string): string | undefined {
    try {
      return new URL(url).hostname;
    } catch {
      console.error("Error: Invalid URL format");
      process.exit(1);
    }
  }

  async writeFile(fileName: string, data: Array<CacheEntry>): Promise<void> {
    const path = this.getFilePath(fileName);
    try {
      await fs.access(this.directory);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await fs.mkdir(this.directory, { recursive: true });
      } else {
        throw new Error(`Error writing file: ${error.message}`);
      }
    }
    await fs.writeFile(path, JSON.stringify(data));
  }

  async readFile(fileName: string): Promise<Array<CacheEntry> | boolean> {
    const path = this.getFilePath(fileName);
    try {
      const data = await fs.readFile(path, "utf8");
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") return false;
      throw new Error("Error reading file");
    }
  }

  async deleteFile(fileName: string) {
    const path = this.getFilePath(fileName);
    try {
      await fs.rm(path);
    } catch (error) {
      console.error("Error deleting file");
    }
  }
}
