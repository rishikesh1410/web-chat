const fs = require("fs");
const path = require("path");
const connect = require('./connect');
const functions = require('./functions');

// Main Function
async function execute() {

    const containerName = "demo";
    var localFilePath1 = "./database/tables.json";
    var localFilePath2 = "./database/users.json";
    var localFilePath3 = "./database/data/iris.json";

    //const containerClient = await functions.createcontainer(connect.blobServiceClient, containerName);
    const containerClient = connect.blobServiceClient.getContainerClient(containerName);
    await functions.showcontainers(connect.aborter, connect.blobServiceClient);
    
    const blockBlobClient1 = await functions.uploadlocalfile(connect.aborter, containerClient, localFilePath1);
    const blockBlobClient2 = await functions.uploadlocalfile(connect.aborter, containerClient, localFilePath2);
    const blockBlobClient3 = await functions.uploadlocalfile(connect.aborter, containerClient, localFilePath3);

    await functions.showblobs(connect.aborter, containerClient, containerName);

    //await functions.downloadcontent(blockBlobClient3.blockBlobClient, connect.aborter);

    // await functions.deleteblob(blockBlobClient1.blockBlobClient, aborter, blockBlobClient1.fileName);
    // await functions.deleteblob(blockBlobClient2.blockBlobClient, aborter, blockBlobClient2.fileName);
    // await functions.deletecontainer(containerClient, aborter, containerName);
    
}

// Calling the function
//module.exports=execute().then(() => console.log("Done")).catch((e) => console.log(e));
execute().then(() => console.log("Done")).catch((e) => console.log(e));
