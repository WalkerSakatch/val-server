import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

import { getMaps, getVersion, getWeapons } from "valorant-api-helper";

// DataDragon Equiv:
// https://valorant.dyn.riotcdn.net/x/content-catalog/PublicContentCatalog-release-XX.XX.zip

let app = express()
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

app.get('/version', async(req, res) => {
    let data = await getVersion();
    res.statusCode = data.status;
    res.send(data.data)
});

app.get('/weapons', async(req, res) => {
    let data = await getWeapons();
    res.statusCode = data.status;
    res.send(data.data);
});

app.get('/maps', async(req, res) => {
    let data = await getMaps();
    res.statusCode = data.status;
    res.send(data.data)
});