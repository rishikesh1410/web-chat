const fs = require("fs");
const path = require("path");
// For Listing All the Containers
async function showContainerNames(aborter, blobServiceClient) {
    console.log("Containers:");
    let iter = await blobServiceClient.listContainers(aborter);
    for await (const container of iter) {
      console.log(` - ${container.name}`);
    }
}

// For Uploading a Local File
async function uploadLocalFile(aborter, containerClient, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    console.log(`Local file "${filePath}" is uploaded`);
    await blockBlobClient.uploadFile(filePath,aborter);
    return {blockBlobClient,fileName};
}

// For Uploading a Local File as a Stream
async function uploadStream(aborter, containerClient, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath).replace('.md', '-STREAM.md');

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    const stream = fs.createReadStream(filePath, {
      highWaterMark: FOUR_MEGABYTES,
    });

    const uploadOptions = {
        bufferSize: FOUR_MEGABYTES,
        maxBuffers: 5,
    };
    console.log(`Local file "${filePath}" is uploaded as a stream`);
    await blockBlobClient.uploadStream(
                    stream, 
                    uploadOptions.bufferSize, 
                    uploadOptions.maxBuffers,
                    aborter);
    return blockBlobClient;
}

// For Listing All the blobs inside a Container
async function showBlobNames(aborter, containerClient, containerName) {
    console.log(`Blobs in "${containerName}" container:`);
    let iter = await containerClient.listBlobsFlat(aborter);
    for await (const blob of iter) {
      console.log(` - ${blob.name}`);
    }
}

// [Node.js only] A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
}

// Create a Container
async function createContainer(blobServiceClient, containerName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.create();
    console.log(`Container: "${containerName}" is created`);
    return containerClient;
}

// Download the Content of a Blob
async function downloadContent(blockBlobClient, aborter) {
    const downloadResponse = await blockBlobClient.download(0,aborter);
    const downloadedContent = await streamToString(downloadResponse.readableStreamBody);

    //console.log(`Downloaded blob content: "${downloadedContent}"`);
    return downloadedContent;
}

// Upload a Blob
async function uploadBlob(containerClient, content, aborter, blobName) {
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    await blockBlobClient.upload(content, content.length, aborter);
    console.log(`Blob "${blobName}" is uploaded`);
    return blockBlobClient;
}

// Delete a Blob
async function deleteBlob(blockBlobClient, aborter, blobName) {
    await blockBlobClient.delete(aborter);
    console.log(`Block blob "${blobName}" is deleted`);
}

// Delete a Container
async function deleteContainer(containerClient, aborter, containerName) {
    await containerClient.delete(aborter);
    console.log(`Container "${containerName}" is deleted`);
}

// Get ContainerClient
async function getContainer(blobServiceClient, containerName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return containerClient;
}

async function getBlob(containerClient, blobName) {
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    return blockBlobClient;
}


module.exports = {
    showcontainers : showContainerNames,
    uploadlocalfile : uploadLocalFile,
    uploadfileasastream : uploadStream,
    showblobs : showBlobNames,
    streamtostring : streamToString,
    createcontainer : createContainer,
    downloadcontent : downloadContent,
    uploadblob : uploadBlob,
    deleteblob : deleteBlob,
    deletecontainer : deleteContainer,
    getblob : getBlob,
    getcontainer : getContainer
}