import fs from "node:fs/promises";

export default class FileManager {
    static directory = "expenses/";

    async writeFile(fileName, data) {
        const path = FileManager.directory + `${fileName}.json`;
        try {
            await fs.access(path);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.mkdir(FileManager.directory, { recursive: true });
            } else {
                console.error(error);
                throw new Error("Unexpected error occurred while writing file");
            }
        }
        await fs.writeFile(path, JSON.stringify(data));
    }

    async readFile(fileName) {
        const path = FileManager.directory + `${fileName}.json`;
        try {
            await fs.access(path);
            const data = await fs.readFile(path, { encoding: 'utf8' });
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return "File not found"
            }
            console.error(error);
            throw new Error("Unexpected error occurred while reading file");
        }
    }
}