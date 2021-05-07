import express from "express";
import ip from "ip";
import cors from "cors";

import https from "https";
import fs from "fs";

import DbConnection from "./util/db";
import Logger from "./util/logger";

const logger: Logger = new Logger("API");

const app = express();
app.use(express.json());
app.use(cors())

const db: DbConnection = new DbConnection({
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
}, logger)

app.get("/api/v1/channels", async (req, resp) => {
    let channels = await db.query("SELECT * FROM channels");

    resp.json(channels);
})

app.get("/api/v1/channel/:id", async (req, resp) => {

    const channel_id = req.params.id;

    let channelName = await db.query("SELECT name FROM channels WHERE id = ?", [channel_id]);
    let features = await db.query("SELECT features.name AS name, features.description AS description FROM features, channel_features WHERE features.id = feature_id AND channel_id = ?", [Number(channel_id)]);
    channelName = channelName[0]["name"];

    let res = {
        name: channelName,
        features: features
    };

    resp.json(res);
})

app.get("/api/v1/channel/:id/pretzelrocks", async (req, resp) => {

    const channel_id = req.params.id;
    let channelName = await db.query("SELECT name FROM channels WHERE id = ?", [channel_id]);
    let data = await db.query("SELECT * FROM pretzelrocks_data WHERE channel_id = ?", [Number(channel_id)]);
    channelName = channelName[0]["name"];

    let res = {
        name: channelName,
        data: data
    };

    resp.json(res);
})

app.post("/api/v1/channel/:id/pretzelrocks", async (req, resp) => {

    const { last_song, last_link, last_used } = req.body;
    const channel_id = req.params.id;

    if (!(last_used || last_song || last_link)) {
        logger.error({ text: `last_song = ${last_song}, last_link = ${last_link}, last_used = ${last_used}` });
        resp.json({
            error: "No values were provided."
        })
    }

    let channelName = await db.query("SELECT name FROM channels WHERE id = ?", [channel_id]);
    channelName = channelName[0]["name"];

    await db.query(`INSERT INTO pretzelrocks_data (last_song, last_link, last_used, channel_id) VALUES (
        ?, ?, ?, ?
    )`, [last_song, last_link, last_used, channel_id]);
    let data = await db.query("SELECT * FROM pretzelrocks_data WHERE channel_id = ?", [Number(channel_id)]);

    let res = {
        name: channelName,
        data: data
    };

    resp.json(res);
})

app.patch("/api/v1/channel/:id/pretzelrocks", async (req, resp) => {

    const { last_song, last_link, last_used } = req.body;
    const channel_id = req.params.id;

    if (!(last_used || last_song || last_link)) {
        logger.error({ text: `last_song = ${last_song}, last_link = ${last_link}, last_used = ${last_used}` });
        resp.json({
            error: "No values were provided."
        })
    }

    let channelName = await db.query("SELECT name FROM channels WHERE id = ?", [channel_id]);
    channelName = channelName[0]["name"];

    await db.query("UPDATE pretzelrocks_data SET last_song = ?, last_link = ?, last_used = ? WHERE channel_id = ?", [last_song, last_link, last_used, channel_id]);
    let data = await db.query("SELECT * FROM pretzelrocks_data WHERE channel_id = ?", [Number(channel_id)]);

    let res = {
        name: channelName,
        data: data
    };

    resp.json(res);
})

app.get("/api/v1/features", async (req, resp) => {
    let features = await db.query("SELECT * FROM features");

    resp.json(features);
})

app.post("/api/v1/features", async (req, resp) => {
    const { name, description } = req.body;

    if (!(name || description)) {
        logger.error({ text: `Tried to create feature, but name or description wasnt found` })
        resp.json({
            error: `Missing name or description`
        })
    }

    await db.query("INSERT INTO features (name, description) VALUES (?, ?)", [name, description]);

    let features = await db.query("SELECT * FROM features WHERE name = ? AND description = ?", [name, description]);
    resp.json(features);
})

app.post("/api/v1/channel/assign_feature", async (req, resp) => {
    const { channel_id, feature_id } = req.body;

    if (!(channel_id || feature_id)) {
        logger.error({ text: `Tried to assign feature, but either channel_id or feature_id wasnt found` })
        resp.json({
            error: `Missing channel_id or feature_id`
        })
    }

    await db.query("INSERT INTO channel_features (channel_id, feature_id) VALUES (?, ?)", [channel_id, feature_id]);

    let channelName = await db.query("SELECT name FROM channels WHERE id = ?", [channel_id]);
    let features = await db.query("SELECT features.name AS name, features.description AS description FROM features, channel_features WHERE features.id = feature_id AND channel_id = ?", [Number(channel_id)]);
    channelName = channelName[0]["name"];

    let res = {
        name: channelName,
        features: features
    };

    resp.json(res);
})

https.createServer({
    key: fs.readFileSync("crypto/server.key"),
    cert: fs.readFileSync("crypto/server.cert")
}, app)
    .listen(
        process.env.API_PORT, async () => {

            let dbState = await db.connect();
            if (dbState != "connected") {
                logger.error({ text: "Couldnt connect to database. Restarting..." })
                process.exit(1);
            }
            logger.info({ text: "Connected to database." })

            logger.info({
                text: `API Server listening on https://${ip.address()}:${process.env.API_PORT}`
            })
        });
