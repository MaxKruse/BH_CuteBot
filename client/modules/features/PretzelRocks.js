let store = {
    "lastUsed": 0,
    "lastSong": "",
    "lastLink": ""
}

const Response = require("../Response");
const EnumResponses = require("../Enum");

function PretzelRocksCommand(tags, m) {
    let parts = m.split(" ");
    let command = parts.shift();

    // message listeners without arguments, ignore nightbot
    if (command === "!song" && tags.username != "nightbot") {
        // only trigger if we know the song
        if (store.lastSong === "" || store.lastLink === "") return new Response(EnumResponses.FailedCommand, "", ["!song knowledge limiter"]);

        // less than 30s since last trigger, calm down guys...
        if (store.lastUsed > (Date.now() / 1000) - 30) return new Response(EnumResponses.FailedCommand, "", ["!song cooldown limiter"]);

        store.lastUsed = Date.now() / 1000;

        return new Response(EnumResponses.PretzelrocksCommand,
            `@${tags["display-name"]} current Song: ${store.lastSong}`,
            [
                `@${tags["display-name"]} asked for the Pretzelrocks song`,
                JSON.stringify(store, null, 2)
            ])
    }
}

function PretzelRocksListener(tags, m) {
    // message listeners from people
    if (tags.username.toLowerCase() == "pretzelrocks") {
        let song = m.split(" -> ")[0].replace("Now Playing: ", "");
        let link = m.split(" -> ")[1];
        store.lastSong = song;
        store.lastLink = link;

        return new Response(EnumResponses.PretzelrocksSong,
            "",
            [
                `Found Pretzelrocks Song`,
                JSON.stringify(store, null, 2)
            ]);
    }
}

module.exports.Command = PretzelRocksCommand;
module.exports.Listener = PretzelRocksListener;
