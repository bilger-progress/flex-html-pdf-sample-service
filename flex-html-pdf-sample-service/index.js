"use-strict"

// External dependencies.
const fs = require("fs");
const bluebird = require("bluebird");
const kinveyFlexSDK = require("kinvey-flex-sdk");

// Flex service version.
const { version: serviceVersion } = require("./package.json");

// Internal handlers.
const takeShot = require("./take-shot");
const uploadShot = require("./upload-shot");

// File path and name for the conversion process.
const CONVERTED_FILE_PATH = "./converted.pdf";

// Initialize the Flex service.
kinveyFlexSDK.service((err, flex) => {
    if (err) {
        console.log("Error while initializing Flex!");
        console.error(err);
        return;
    }
    // Register the Flex function.
    flex.functions.register("convert", (context, complete, modules) => {
        takeShot(context.body.url)
            .then((shot) => {
                const writeFilePromisified = bluebird.promisify(fs.writeFile);
                return writeFilePromisified(CONVERTED_FILE_PATH, shot.content.data, { encoding: shot.content.encoding });
            })
            .then(() => {
                return uploadShot(
                    { token: context.headers.authorization },
                    {
                        size: fs.statSync(CONVERTED_FILE_PATH).size,
                        file: fs.readFileSync(CONVERTED_FILE_PATH)
                    },
                    modules.backendContext.getAppKey()
                );
            }).then((data) => {
                console.log(JSON.stringify(data));
                return complete().setBody({
                    success: true,
                    debug: "Success. Please check logs.",
                    serviceVersion
                }).ok().next();
            }).catch((error) => {
                console.error(JSON.stringify(error));
                return complete().setBody({
                    success: false,
                    debug: "Error occured. Please check logs.",
                    serviceVersion
                }).runtimeError().done();
            });
    });
});