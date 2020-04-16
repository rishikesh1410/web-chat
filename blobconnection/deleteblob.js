const fs = require("fs");
const path = require("path");
const connect = require('./connect');
const functions = require('./functions');

// Main Function
async function execute() {

    const containerName = "old";
    const blobName = "tables.json";

    const containerClient = connect.blobServiceClient.getContainerClient(containerName);
    
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    await functions.deleteblob(blockBlobClient, connect.aborter, blobName);
    await functions.showblobs(connect.aborter, containerClient, containerName);
   
}

// Calling the function
//module.exports=execute().then(() => console.log("Done")).catch((e) => console.log(e));
execute().then(() => console.log("Done")).catch((e) => console.log(e));
