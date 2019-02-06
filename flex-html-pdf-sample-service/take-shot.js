"use strict"

// TODO: Set your API Key.
const phantomJsCloud = require("phantomjscloud");
const browserApi = new phantomJsCloud.BrowserApi("xxx");

/**
 * Takes the screen-shot and gives back the valid data.
 */
module.exports = (path) => {
    return new Promise((resolve, reject) => {
        browserApi.requestSingle({
            url: path,
            renderType: "pdf"
        }, (requestSingleError, requestSingleData) => {
            if (requestSingleError) {
                return reject(requestSingleError);
            }
            return resolve(requestSingleData);
        });
    });
};