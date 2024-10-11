import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import UnitConverterController from "../controllers/unitConvert.controller.js";
const unitController = new UnitConverterController()
const unitConverterRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

unitConverterRouter.use(express.static(path.join(__dirname, '../public')));
unitConverterRouter.get("/", unitController.loadHtml)
unitConverterRouter.post("/convert", unitController.convertUnit)
export default unitConverterRouter;