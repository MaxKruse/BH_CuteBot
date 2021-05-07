const axios = require("axios");
const https = require("https");
const BASE_URL = "http://api:5000/api/v1";

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

module.exports.request = request;
module.exports.createCutebotRequest = createCutebotRequest;