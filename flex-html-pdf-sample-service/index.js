"use-strict"

// External dependencies.
const fs = require("fs");
const kinveyFlexSDK = require("kinvey-flex-sdk");

// Service version.
const { version: serviceVersion } = require("./package.json");

// Internal handlers.
const takeShot = require("./take-shot");
const uploadShot = require("./upload-shot");

// Initialize Kinvey Flex.
kinveyFlexSDK.service((err, flex) => {
    if (err) {
        console.log("Error while initializing Flex!");
        return;
    }
    // Register Flex Function.
    flex.functions.register("convert", (context, complete, modules) => {
        return takeShot(context.body.pageToBeConverted)
            .then((takenShot) => {
                fs.writeFile("./converted.pdf", takenShot.content.data, { encoding: takenShot.content.encoding }, (writeFileError) => {
                    if (writeFileError) {
                        console.error("Write File Error: " + writeFileError);
                        return complete().setBody({
                            success: false,
                            debug: "Error occured. Please check logs.",
                            serviceVersion: serviceVersion
                        }).runtimeError().done();
                    }
                    // File saved locally. Start upload process.
                    return uploadShot({
                        userToken: context.headers["authorization"]
                    }, {
                            size: fs.statSync("./converted.pdf").size,
                            actualFile: fs.readFileSync("./converted.pdf")
                        });
                });
            }).then((processSuccessData) => {
                console.log("Process Success Data: " + processSuccessData);
                return complete().setBody({
                    success: "true",
                    debug: "Success. Please check logs.",
                    serviceVersion: serviceVersion
                }).ok().next();
            }).catch((processFailureError) => {
                console.error("Process Failure Error: " + processFailureError);
                return complete().setBody({
                    success: false,
                    debug: "Error occured. Please check logs.",
                    serviceVersion: serviceVersion
                }).runtimeError().done();
            });
    });
});