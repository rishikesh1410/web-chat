const fs = require("fs");
const path = require("path");
const connect = require('./connect');
const functions = require('./functions');

// Main Function
async function execute() {

    const containerName = "demo";
    var localFilePath = "./database/users.json";

    const containerClient = connect.blobServiceClient.getContainerClient(containerName);
    await functions.showcontainers(connect.aborter, connect.blobServiceClient);
    
    const blockBlobClient = await functions.uploadlocalfile(connect.aborter, containerClient, localFilePath);
    await functions.showblobs(connect.aborter, containerClient, containerName);

}

// Calling the function
//module.exports=execute().then(() => console.log("Done")).catch((e) => console.log(e));
execute().then(() => console.log("Done")).catch((e) => console.log(e));
