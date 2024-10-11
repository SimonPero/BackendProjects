import express from "express"
import unitConverterRouter from "./routers/unitConvert.route.js";
const app = express();
const port = 8080

app.use("/api", unitConverterRouter)

app.get('/', (req, res) => {
    res.redirect('/api');
});
app.listen(port, async () => {
    try {
        console.log(`Servidor escuchando http://localhost:${port}`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});