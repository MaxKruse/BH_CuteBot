const EnumResponses = require("./Enum");
const Response = require("./Response");

const PretzelRocks = require("./features/PretzelRocks");
const Mention = require("./features/Mention");

const { createCutebotRequest, request } = require("./requests");

class Channel {

    constructor(client, name) {
        this.client = client;
        this.name = name;
        // remove # and lowercase it
        this.cleanName = this.name.replace("#", "").toLowerCase();
        this.features = [];

        this.id = -1;
    }

    getId() {
        return this.id;
    }

    setFeatures(feats) {
        this.features = feats;
    }

    checkMessage(tags, message) {
        // Syntax highlighting in vscode
        let m = String(message);

        // Response for each message
        let r = new Response(EnumResponses.NoCommand, "", ["No Command"]);

        if (this.features.includes("pretzelrocks")) {
            r = PretzelRocks.Listener(tags, m) || r;

            r = PretzelRocks.Command(tags, m) || r;
        }

        this.send(r.message);

        return r;
    }

    send(message) {
        if (message !== "")
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

module.exports = Channel;