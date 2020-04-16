const fs = require("fs");
const path = require("path");
const connect = require('./connect');
const functions = require('./functions');

// Main Function
async function execute() {

    const containerName = "old";

    const containerClient = connect.blobServiceClient.getContainerClient(containerName);
    
    await functions.deletecontainer(containerClient, connect.aborter, containerName);
    await functions.showcontainers(connect.aborter, connect.blobServiceClient);
}

// Calling the function
//module.exports=execute().then(() => console.log("Done")).catch((e) => console.log(e));
execute().then(() => console.log("Done")).catch((e) => console.log(e));
