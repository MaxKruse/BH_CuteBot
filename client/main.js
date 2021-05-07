const tmi = require("tmi.js");
const Channel = require("./modules/channel");
const EnumResponses = require("./modules/Enum");
const loggerClass = require("./modules/logger");
const axios = require("axios");

const https = require("https");

const BASE_URL = "https://api:5000/api/v1";
const logger = new loggerClass("BH_CuteBot");
const USERNAME = process.env.BOT_USERNAME || "usrname";
const PASSWORD = process.env.BOT_PASSWORD || "passwd";
const CHANNELS_STRING = process.env.CHANNELS || "a,b,c";

// Check if we run a default .env file for some reason 
if (USERNAME == "usrname" && PASSWORD == "passwd" && CHANNELS_STRING == "a,b,c") {
  logger.error({ text: "Found default config, exiting..." });
  return;
}

const CHANNELS = CHANNELS_STRING.split(",")

logger.debug({ text: `Startup with ${JSON.stringify(process.env, space = 2)}` })

// Bot Start
let channelList = CHANNELS;

const client = new tmi.Client({
  connection: { reconnect: true },
  channels: channelList,
  identity: {
    username: USERNAME,
    password: PASSWORD
  }
})

client.connect();
logger.debug({ text: `Connecting to ${channelList}` })

// Add channel objects
let channelArray = []

// For each channel, create a logger
channelList.forEach(async (channelName) => {
  logger.addLogger(channelName);
  let c = new Channel(client, channelName);
  channelArray.push(c)
})

client.on("connected", (addr, port) => {
  logger.info({ text: `Connected to ${addr}:${port}` })
  refreshChannelConfigs();
})

client.on("message", (channelName, tags, message, self) => {
  if (self || tags.username === USERNAME) return;

  let tmpCh = channelArray.find(ch => ch.name === channelName);
  if (!tmpCh) return;
  let response = tmpCh.checkMessage(tags, message);

  if (response.type != EnumResponses.NoCommand)
    logger.info({
      logger: channelName,
      text: JSON.stringify(response, null, 2)
    });
})

async function refreshChannelConfigs() {

  logger.info({ text: "Trying to get channels info" })
  // get all channels in the database
  let channels = await getAPI("/channels")
  logger.info({ text: `Got: ${JSON.stringify(channels)}` })

  // for every channel
  channelArray.forEach(async (channel) => {
    let channelName = String(channel.name).replace("#", "").toLowerCase();
    logger.info({ text: `Updating features for ${channelName}` });

    let dbChannel = channels.find(ch => ch.name === channelName);
    if (!dbChannel) {
      logger.error({ text: `No DB Entry found for ${channelName}` });
      channel.setFeatures([]);
      return;
    }
    // get the features for this channel
    let dbChannelInfo = await getAPI(`/channel/${dbChannel.id}`);
    // assign features to this channel directly
    // Changes the array 
    // [{"feature_name":"pretzelrocks","feature_description":"Adds a listener for !song and sends whatever the PretzelRocks bot sent before in the chat. Its ugly, but it works."}]
    // to
    // ["pretzelrocks"]
    let arr = dbChannelInfo.features.map((feat) => feat.name);
    channel.setFeatures(arr);
    // set channel id
    channel.id = dbChannel.id;

    logger.info({ text: `Config Updated for ${channel.cleanName}: ID=${channel.id} - FEATURES=${channel.features.join(", ")}` });
  });

  // Every 5 Minutes, refresh all channel configs
  setTimeout(refreshChannelConfigs, 5 * 60000);
}

// wrapper to make async behave as sync
async function getAPI(url) {
  return new Promise((resolve, reject) => {
    request(createCutebotRequest(url), (data) => {
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
      logger.error({ text: JSON.stringify(err) });
    })
}

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function createCutebotRequest(path, params = {}) {
  return {
    url: BASE_URL + path,
    params: params,
    maxContentLength: 15000,
    httpsAgent: httpsAgent
  }
}