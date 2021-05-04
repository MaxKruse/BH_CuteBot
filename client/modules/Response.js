const responseType = require("./Enum")

class Response {
    type = responseType.FailedCommand;
    data = [];
    message = "";

    constructor(type = responseType.FailedCommand, message, data = []) {
        this.type = type;
        this.message = String(message);
        this.data = data;
    }
}

module.exports = Response;