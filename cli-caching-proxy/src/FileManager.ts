import fs from "node:fs/promises";

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

  async writeFile(fileName: string, data: Array<object>): Promise<void> {
    const path = this.getFilePath(fileName);
    try {
      await fs.access(path);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        await fs.mkdir(this.directory, { recursive: true });
      } else throw new Error("Error writing file");
    }
    await fs.writeFile(path, JSON.stringify(data));
  }

  async readFile(fileName: string): Promise<Array<object> | boolean> {
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
