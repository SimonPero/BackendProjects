import fs from "node:fs/promises";

export default class FileManager {
    static directory = "expenses/";
    static csvDirectory = "csvFiles/";

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

    async writeCsv(fileName, data) {
        const path = FileManager.csvDirectory + `${fileName}.csv`;

        function formatValue(header, value) {
            if (value === undefined) return '""';

            switch (header) {
                case 'id':
                    return `"${value}"`;
                case 'description':
                    return `"${value}";"";""`;
                case 'amount':
                    return value;
                case 'category':
                    return `"${value}"`;
                default:
                    return value instanceof Date
                        ? `"${value.toISOString().split('T')[0]}"`
                        : `"${String(value).replace(/"/g, '""')}"`;
            }
        }

        function createCsv(data) {
            try {
                const headers = Object.keys(data[0]);

                const headerRow = headers.map(header =>
                    header === "description" ? `"${header}";"";""` : `"${header}"`
                ).join(';"";');

                const dataRows = data.map(row =>
                    headers.map(header => formatValue(header, row[header])).join(';"";')
                );

                return [headerRow, ...dataRows].join('\n');
            } catch (err) {
                console.error('Error processing data:', err);
                process.exit(1);
            }
        }

        const csvData = createCsv(data);

        try {
            await fs.access(path);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.mkdir(FileManager.csvDirectory, { recursive: true });
            } else {
                console.error(error);
                throw new Error("Unexpected error occurred while writing file");
            }
        }
        await fs.writeFile(path, csvData);
    }
}