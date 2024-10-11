import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class UnitConverterController {
    async loadHtml(req, res) {
        const __dirname = path.dirname(__filename);
        res.sendFile(path.join(__dirname, '../public/length.html'));
    }
}