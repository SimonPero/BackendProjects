import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class UnitConverterController {
    async loadHtml(req, res) {
        const __dirname = path.dirname(__filename);
        res.sendFile(path.join(__dirname, '../public/length.html'));
    }
    async convertUnit(req, res) {
        try {
            const { typeUnit, value, fromUnit, toUnit } = req.body
            function convertLength(va, fUnit, tUnit) {
                const conversionRatesToMeter = {
                    ml: 0.001,
                    cm: 0.01,
                    m: 1,
                    km: 1000,
                    inch: 0.0254,
                    foot: 0.3048,
                    yard: 0.9144,
                    mile: 1609.34
                };
                const fromRate = conversionRatesToMeter[fUnit]
                const toRate = conversionRatesToMeter[tUnit]
                if (!fromRate || !toRate) {
                    throw new Error("Unidad no válida.");
                }
                const valueMeter = va * fromRate
                const convertedValue = valueMeter / toRate
                return { value: va, convertedValue: convertedValue }
            }
            function convertWeight(va, fUnit, tUnit) {
                const conversionRatesToKilogram = {
                    mg: 1e-6,
                    g: 0.001,
                    kg: 1,
                    oz: 0.0283495,
                    lb: 0.453592
                };
                const fromRate = conversionRatesToKilogram[fUnit]
                const toRate = conversionRatesToKilogram[tUnit]
                if (!fromRate || !toRate) {
                    throw new Error("Unidad no válida.");
                }
                const valueMeter = va * fromRate
                const convertedValue = valueMeter / toRate
                return { value: va, convertedValue: convertedValue }
            }
            function convertTemperature(va, fUnit, tUnit) {
                if (fUnit === "C" && tUnit === "F") {
                    const convertedValue = (va * 9 / 5) + 32;
                    return { value: va, convertedValue: convertedValue }
                }
                if (fUnit === "F" && tUnit === "C") {
                    const convertedValue = (va - 32) * 5 / 9;
                    return { value: va, convertedValue: convertedValue }
                }
                if (fUnit === "C" && tUnit === "K") {
                    const convertedValue = va + 273.15;
                    return { value: va, convertedValue: convertedValue }
                }
                if (fUnit === "K" && tUnit === "C") {
                    const convertedValue = va - 273.15;
                    return { value: va, convertedValue: convertedValue }
                }
                if (fUnit === "F" && tUnit === "K") {
                    const convertedValue = (va + 459.67) * 5 / 9;
                    return { value: va, convertedValue: convertedValue }
                }
                if (fUnit === "K" && tUnit === "F") {
                    const convertedValue = (va * 9 / 5) - 459.67;
                    return { value: va, convertedValue: convertedValue }
                }
            }
            const convertionStrategies = {
                "length": convertLength,
                "weight": convertWeight,
                "temperature": convertTemperature
            }
            const convertionFunction = convertionStrategies[typeUnit]
            if (convertionFunction) {
                const result = convertionFunction(value, fromUnit, toUnit)
                return res.status(200).json(result)
            }
            return res.status(404).json({ error: "Were not capable of identifying the kind of convertion" })
        } catch (error) {
            console.error(error)
            return res.status(404).json({ error: "Unexpected error has occurred" })
        }
    }
}