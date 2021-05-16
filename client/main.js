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

// Check if we run a default .env file for some reason 
if (USERNAME == "usrname" && PASSWORD == "passwd") {
  logger.error({ text: "Found default config, exiting..." });
  return;
}

// Add channel objects
let channelArray = []
let client;

makeclient();

async function makeclient() {
  let channels = await getAPI("/channels");
  channels = channels.map(i => i.name);

  logger.debug({ text: `Startup with ${JSON.stringify(process.env, space = 2)}` })

  // Bot Start
  let channelList = channels;

  client = new tmi.Client({
    connection: { reconnect: true },
    channels: channelList,
    identity: {
      username: USERNAME,
      password: PASSWORD
    }
  });

  client.connect();
  logger.debug({ text: `Connecting to ${channelList}` })

  // For each channel, create a loggerj
  channelList.forEach(async (channelName) => {
    logger.addLogger(channelName);
    let c = new Channel(client, channelName);
    channelArray.push(c)
  })

  client.on("connected", async (addr, port) => {
    logger.info({ text: `Connected to ${addr}:${port}` })
    await refreshChannelConfigs();
  })

  client.on("message", async (channelName, tags, message, self) => {
    if (self || tags.username === USERNAME) return;

    let tmpCh = channelArray.find(ch => ch.name === channelName);
    if (!tmpCh) return;
    let response = await tmpCh.checkMessage(tags, message);

    if (response.type != EnumResponses.NoCommand)
      logger.info({
        logger: channelName,
        text: JSON.stringify(response, null, 2)
      });
  })
}

async function refreshChannelConfigs() {

  logger.debug({ text: "Trying to get channels info" })
  // get all channels in the database
  let channels = await getAPI("/channels")
  logger.debug({ text: `Got: ${JSON.stringify(channels)}` })

  // Check if we need to reconnect/change which channels we are connecting to
  let channelsAsClient = channels.map(i => i.name);
  let channelsFromClient = client.getChannels();

  // reconnect all channels
  logger.debug({ text: "Leaving all..." })
  for (let a in channelsFromClient) {
    await client.part(a).catch(e => console.log(e));
  }

  logger.debug({ text: "Joining all..." })
  for (let a in channelsAsClient) {
    await client.join(a).catch(e => console.log(e));
  }

  // for every channel
  channelArray.forEach(async (channel) => {
    let channelName = String(channel.name).replace("#", "").toLowerCase();
    logger.debug({ text: `Updating features for ${channelName}` });

    let dbChannel = channels.find(ch => ch.name === channelName);
    if (!dbChannel) {
      logger.debug({ text: `No DB Entry found for ${channelName}, setting features to []` });
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

    logger.debug({ text: `Config Updated for ${channel.cleanName}: ID=${channel.id} FEATURES=${channel.features.join(", ")}` });
  });

  logger.info({ text: "Updated channel configs" });

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
      logger.error({ text: err });
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