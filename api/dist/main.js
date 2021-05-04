"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ip_1 = __importDefault(require("ip"));
const Logger = require("./util/logger");
const DbConnection = require("./util/db");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const logger = new Logger("API");
const app = express_1.default();
app.use(express_1.default.json());
app.get("/api/v1/channels", (req, resp) => {
    let res = db.query("SELECT * FROM channels");
    logger.info(JSON.stringify(res));
    resp.json({ res });
});
app.get("/api/v1/channel/:id", (req, resp) => {
    let res;
    res.id = Number(req.params.id);
    res.name = db.query(`SELECT name FROM channels WHERE id = ${[req.params.id]}`)[0];
    res.features = [];
    let a = db.query("SELECT feature.name, feature.description FROM channels, features, channel_features WHERE channels.id = channel_id AND features.id = feature_id");
    res.features = a;
    logger.info(JSON.stringify(res));
    resp.json({ res });
});
app.get("/api/v1/features", (req, resp) => {
    let res = db.query("SELECT * FROM features");
    logger.info(JSON.stringify(res));
    resp.json({ res });
});
const db = new DbConnection({
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
}, logger);
https_1.default.createServer({
    key: fs_1.default.readFileSync("crypto/server.key"),
    cert: fs_1.default.readFileSync("crypto/server.cert")
}, app).listen(process.env.API_PORT, () => {
    if (!db.IsConnected()) {
        logger.error("Couldnt connect to database.");
        process.exit();
    }
    logger.info({
        text: `API Server listening on https://${ip_1.default.address()}:${process.env.API_PORT}`
    });
});
//# sourceMappingURL=main.js.map