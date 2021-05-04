import axios, { AxiosRequestConfig } from "axios";

const BASE_URL: string = "https://localhost:5000/api/v1";

export default {
    getChannels(callback: any) {
        request(createCutebotRequest("/channels"), callback);
    },
    getChannel(id: number, callback: any) {
        request(createCutebotRequest(`/channel/${id}`), callback);
    },
    getFeatures(callback: any) {
        request(createCutebotRequest("/features"), callback);
    },
    addFeature(channel_id: number, feature_id: number, callback: any) {
        let req = createCutebotRequest("/channel/assign_feature")

        req.method = "POST";
        req.data = {
            channel_id: channel_id,
            feature_id: feature_id
        }

        request(req, callback);
    },

    featureData: {
        getPretzelRocksData(id: number, callback: any) {
            request(createCutebotRequest(`/channel/${id}/pretzelrocks`), callback);
        }
    }
}

function request(req: any, callback: any) {
    axios(req)
        .then(resp => {
            callback(resp.data, resp)
        })
        .catch(err => {
        })
}

function createCutebotRequest(path: string, params: any = {}): AxiosRequestConfig {
    return {
        url: BASE_URL + path,
        params: params,
        maxContentLength: 15000,
    }
}
