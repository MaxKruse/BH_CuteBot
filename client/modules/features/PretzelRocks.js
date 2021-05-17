const Response = require("../Response");
const EnumResponses = require("../Enum");

const BASE_URL = "https://api:5000/api/v1";
const axios = require("axios");

const https = require("https");


async function PretzelRocksCommand(tags, m, id) {
    let parts = m.split(" ");
    let command = parts.shift();

    // message listeners without arguments, ignore nightbot
    if (command === "!song" && tags.username != "nightbot") {
        // get data from api
        let data = await getAPI(`/channel/${id}/pretzelrocks`);
        if (!data) {
            return new Response(EnumResponses.FailedCommand, "", ["Channel not found", id]);
        }

        let last_added = data["data"]["last_added"];
        let last_used = data["data"]["last_used"];
        let last_song = data["data"]["last_song"];
        let last_link = data["data"]["last_link"];

        // only trigger if we know the song, 2h since last add
        if (last_added < (Date.now() / 1000) - (60 * 60 * 2)) return new Response(EnumResponses.FailedCommand, "", ["!song knowledge limiter"]);

        // less than 30s since last trigger, calm down guys...
        if (last_used > (Date.now() / 1000) - 30) return new Response(EnumResponses.FailedCommand, "", ["!song cooldown limiter"]);

        let sendStr = `@$USER Song: ${last_song}`;

        if (parts && parts.length > 0) {
            sendStr = sendStr.replace("$USER", parts[0].replace("@", ""))
        }
        else {
            sendStr = sendStr.replace("$USER", tags["display-name"])
        }

        let req = createCutebotRequest(`/channel/${id}/pretzelrocks`);
        req.method = "PATCH";
        req.data = {
            last_used: Date.now() / 1000
        };

        await patchAPI(req);

        return new Response(EnumResponses.PretzelrocksCommand,
            sendStr,
            [
                `@${tags["display-name"]} asked for the Pretzelrocks song ${parts.join(",")}`,
                JSON.stringify(data, null, 2)
            ])
    }
}

async function PretzelRocksListener(tags, m, id) {
    // message listeners from people
    if (tags.username.toLowerCase() == "pretzelrocks") {
        let song = m.split(" -> ")[0].replace("Now Playing: ", "");
        let link = m.split(" -> ")[1];

        let req = createCutebotRequest(`/channel/${id}/pretzelrocks`);
        req.method = "PATCH";
        req.data = {
            last_song: song,
            last_link: link
        };

        await patchAPI(req);

        return new Response(EnumResponses.PretzelrocksSong,
            "",
            [
                `Found Pretzelrocks Song`,
                JSON.stringify(req.data, null, 2)
            ]);
    }
}

module.exports.Command = PretzelRocksCommand;
module.exports.Listener = PretzelRocksListener;

async function getAPI(url) {
    return new Promise((resolve, reject) => {
        request(createCutebotRequest(url), (data) => {
            resolve(data);
        })
    })
}

async function patchAPI(d) {
    return new Promise((resolve, reject) => {
        request(d, (data) => {
            resolve(data);
        })
    })
}

async function request(req, callback) {
    axios(req)
        .then(resp => {
            callback(resp.data, resp)
        })
        .catch(err => {
            console.log(err);
            console.log(req);
        })
}

function createCutebotRequest(path, params = {}) {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    return {
        url: BASE_URL + path,
        params: params,
        maxContentLength: 15000,
        httpsAgent: httpsAgent
    }
}