"use strict"

const requestPromise = require("request-promise");

module.exports = (authInfo, fileInfo, kinveyAppKey) => {
    return new Promise((resolve, reject) => {
        requestPromise({
            method: "POST",
            uri: "https://baas.kinvey.com/blob/" + kinveyAppKey + "/?tls=true",
            body: {
                mimeType: "application/pdf",
                _public: false,
                _acl: {
                    gr: false
                },
                size: fileInfo.size
            },
            json: true,
            headers: {
                "Content-Type": "application/json",
                "Authorization": authInfo.token,
                "X-Kinvey-API-Version": 3,
                "X-Kinvey-Content-Type": "application/pdf"
            }
        }).then((data) => {
            return requestPromise({
                method: "PUT",
                uri: data._uploadURL,
                body: fileInfo.file,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Length": fileInfo.size
                }
            });
        })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
};