"use strict"

const phantomJsCloud = require("phantomjscloud");

// TODO: Set the API key for your PhantomJs Cloud service.
const browserApi = new phantomJsCloud.BrowserApi("xxx");

module.exports = (url) => {
    return new Promise((resolve, reject) => {
        browserApi.requestSingle({
            url,
            renderType: "pdf"
        }, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data);
        });
    });
};