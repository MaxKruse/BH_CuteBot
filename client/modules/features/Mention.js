const Response = require("../Response");
const EnumResponses = require("../Enum");

function MentionListener(tags, m) {
    // message listeners from people
    if (m.toLowerCase().includes("bh_cutebot")) {
        return new Response(EnumResponses.Mention,
            "",
            [
                "Somebody mentioned my name OwO",
                m,
                tags["display-name"]
            ]);
    }
}

module.exports.Listener = MentionListener;