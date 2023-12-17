import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config();

import { getMaps, getVersion, getWeapons, getAgents, getSprays, login, login2FA, getEntitlementsToken, getRegion, getPlayerInfo, getPlayerLoadout } from "@mrbabalafe/valorant-api-helper";
// import { getMaps, getVersion, getWeapons, getAgents, getSprays, login, login2FA, getEntitlementsToken, getRegion, getPlayerInfo, getPlayerLoadout } from "valorant-api-helper";

// DataDragon Equiv:
// https://valorant.dyn.riotcdn.net/x/content-catalog/PublicContentCatalog-release-XX.XX.zip

let app = express()
app.use(cors());
app.use(bodyParser.json())

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

app.get('/version', async(req, res) => {
    console.log("/version")
    let data = await getVersion();
    res.statusCode = data.status;
    res.send(data.data)
});

//TODO: Make it so you can /weapons/uuid and get info for a particular weapon. Same w/ maps, agents, sprays
app.get('/weapons/:uuid?', async(req, res) => {
    console.log("/weapons")
    const data = req.params.uuid ? await getWeapons(req.params.uuid) : await getWeapons();
    // let data = await getWeapons();
    res.statusCode = data.status;
    res.send(data.data);
});

app.get('/maps/:uuid?', async(req, res) => {
    console.log("/maps")
    const data = req.params.uuid ? await getMaps(req.params.uuid) : await getMaps();
    // let data = await getMaps();
    res.statusCode = data.status;
    res.send(data.data);
});

app.get('/agents/:uuid?', async(req, res) => {
    console.log("/agents")
    // let data = await getAgents();
    const data = req.params.uuid ? await getAgents(req.params.uuid) : await getAgents();
    res.statusCode = data.status;
    res.send(data.data);
});

app.get('/sprays/:uuid?', async(req, res) => {
    console.log(`/sprays/${req.params.uuid}`)
    const data = req.params.uuid ? await getSprays(req.params.uuid) : await getSprays();
    res.statusCode = data.status;
    res.send(data.data);
});

app.post('/auth/login', async(req, res) => {
    console.log("/auth/login")
    let body = req.body;
    console.log("BODY: ", body)
    let loginResponse = await login(body.riotClientBuild, body.username, body.password);
    console.log("LOGIN RESPONSE: ", loginResponse)
    res.send(loginResponse);
});

app.post('/auth/login2fa', async(req, res) => {
    console.log("/auth/login2fa")
    let body = req.body;
    let loginResponse = await login2FA(body.code, body.riotClientBuild, body.cookies)
    res.send(loginResponse);
});

app.post('/auth/entitlements', async(req, res) => {
    console.log("/auth/entitlements")
    let body = req.body;
    let entitlementsResponse = await getEntitlementsToken(body.access_token)
    res.send(entitlementsResponse);
});

app.put('/auth/region', async(req, res) => {
    console.log("/auth/region")
    let body = req.body;
    let regionResponse = await getRegion(body.access_token, body.id_token);
    res.send(regionResponse);
});

app.get('/player/info', async(req, res) => {
    console.log("/player/info")
    let access_token = req.headers.access_token as string;
    // console.log("access_token", access_token)
    let playerInfoResp = await getPlayerInfo(access_token)
    res.send(playerInfoResp)
});

app.get('/player/loadout', async(req, res) => {
    console.log("/player/loadout")
    let access_token = req.headers.access_token as string;
    let entitlements_token = req.headers.entitlements_token as string;
    let shard = req.headers.shard as string;
    let puuid = req.headers.puuid as string;
    let playerLoadoutResp = await getPlayerLoadout(access_token, entitlements_token, shard, puuid);
    res.send(playerLoadoutResp)
});