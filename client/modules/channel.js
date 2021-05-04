const EnumResponses = require("./Enum");
const Response = require("./Response");

const PretzelRocks = require("./features/PretzelRocks");
const Mention = require("./features/Mention");

class Channel {

    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.features = [];
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

        if (this.features.includes("mention")) {
            r = Mention.Listener(tags, m) || r;
        }

        this.send(r.message);

        return r;
    }

    send(message) {
        if (message !== "")
            this.client.say(this.name, message);
    }
}

module.exports = Channel;