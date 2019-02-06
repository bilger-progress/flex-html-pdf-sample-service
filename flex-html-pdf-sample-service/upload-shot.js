"use strict"

const requestPromise = require("request-promise");

// TODO: Set your Kinvey App Key.
// Or you might want to get it from the Request Context of Flex?
const KINVEY_APP_KEY = "kid_xxx";

/**
 * Uploads the screen-shot to Kinvey Files Store.
 * Google Cloud Storage.
 */
module.exports = (authData, fileData) => {
    return new Promise((resolve, reject) => {
        requestPromise({
            method: "POST",
            uri: "https://baas.kinvey.com/blob/" + KINVEY_APP_KEY + "/?tls=true",
            body: {
                mimeType: "application/pdf",
                _public: false,
                _acl: {
                    gr: false
                },
                size: fileData["size"]
            },
            json: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": authData["userToken"],
                "X-Kinvey-API-Version": 3,
                "X-Kinvey-Content-Type": "application/pdf"
            }
        }).then((kinveyFilesData) => {
            return requestPromise({
                method: "PUT",
                uri: kinveyFilesData["_uploadURL"],
                body: fileData["actualFile"],
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Length": fileData["size"]
                }
            });
        }).then((googleStorageData) => {
            return resolve(googleStorageData);
        }).catch((generalError) => {
            return reject(generalError);
        });
    });
};