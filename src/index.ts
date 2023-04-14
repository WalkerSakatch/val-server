import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();

import { getMaps, getVersion, getWeapons, getAgents, login, login2FA, getEntitlementsToken, getRegion, getPlayerInfo, getPlayerLoadout } from "@mrbabalafe/valorant-api-helper";

// DataDragon Equiv:
// https://valorant.dyn.riotcdn.net/x/content-catalog/PublicContentCatalog-release-XX.XX.zip

let app = express()
app.use(cors());
app.use(bodyParser.json())

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
    res.send(data);
});

app.get('/maps', async(req, res) => {
    let data = await getMaps();
    res.statusCode = data.status;
    res.send(data.data);
});

app.get('/agents', async(req, res) => {
    let data = await getAgents();
    res.statusCode = data.status;
    res.send(data.data);
});

app.post('/auth/login', async(req, res) => {
    let body = req.body;
    console.log("BODY: ", body)
    let loginResponse = await login(body.riotClientBuild, body.username, body.password);
    console.log("LOGIN RESPONSE: ", loginResponse)
    res.send(loginResponse);
});

app.post('/auth/login2fa', async(req, res) => {
    let body = req.body;
    let loginResponse = await login2FA(body.code, body.riotClientBuild, body.cookies)
    res.send(loginResponse);
});

app.post('/auth/entitlements', async(req, res) => {
    let body = req.body;
    let entitlementsResponse = await getEntitlementsToken(body.access_token)
    res.send(entitlementsResponse);
});

app.put('/auth/region', async(req, res) => {
    let body = req.body;
    let regionResponse = await getRegion(body.access_token, body.id_token);
    res.send(regionResponse);
});

app.get('/player/info', async(req, res) => {
    let access_token = req.headers.access_token as string;
    // console.log("access_token", access_token)
    let playerInfoResp = await getPlayerInfo(access_token)
    res.send(playerInfoResp)
});

app.get('/player/loadout', async(req, res) => {
    let access_token = req.headers.access_token as string;
    let entitlements_token = req.headers.entitlements_token as string;
    let shard = req.headers.shard as string;
    let puuid = req.headers.puuid as string;
    let playerLoadoutResp = await getPlayerLoadout(access_token, entitlements_token, shard, puuid);
    res.send(playerLoadoutResp)
});