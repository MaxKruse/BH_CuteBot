const EnumResponses = require("./Enum");
const Response = require("./Response");
const axios = require("axios");

const https = require("https");


const PretzelRocks = require("./features/PretzelRocks");

class Channel {

    constructor(client, name) {
        this.client = client;
        this.name = name;
        // remove # and lowercase it
        this.cleanName = this.name.replace("#", "").toLowerCase();
        this.features = [];

        this.id = -1;

        this.getID();
    }

    async getID() {
        let a = await getAPI("/channels");

        let found = a.filter(ch => ch.name == this.cleanName);

        if (found) {
            this.id = found["id"];
        }
    }

    setFeatures(feats) {
        this.features = feats;
    }

    async checkMessage(tags, message) {
        // Syntax highlighting in vscode
        let m = String(message);

        // Response for each message
        let r = new Response(EnumResponses.NoCommand, "", ["No Command"]);

        if (this.features.includes("pretzelrocks")) {
            r = await PretzelRocks.Listener(tags, m, this.id) || r;

            r = await PretzelRocks.Command(tags, m, this.id) || r;
        }

        await this.send(r.message);

        return r;
    }

    async send(message) {
        if (message && message !== "")
            this.client.say(this.name, message);
    }
}

async function getAPI(url) {
    return new Promise((resolve, reject) => {
        request(createCutebotRequest(url), (data) => {
            resolve(data);
        })
    })
}

const BASE_URL = "https://api:5000/api/v1";

async function request(req, callback) {
    axios(req)
        .then(resp => {
            callback(resp.data, resp)
        })
        .catch(err => {
            console.log(JSON.stringify(err));
        })
}


function createCutebotRequest(path, params = {}) {
    return {
        url: BASE_URL + path,
        params: params,
        maxContentLength: 15000,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    }
}

module.exports = Channel;