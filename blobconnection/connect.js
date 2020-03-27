const {
    StorageSharedKeyCredential,
    BlobServiceClient
    } = require('@azure/storage-blob');
const {AbortController} = require('@azure/abort-controller');
const keys = require("../config/keys");


// Storage Account Details
const STORAGE_ACCOUNT_NAME = keys.azure.STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = keys.azure.ACCOUNT_ACCESS_KEY;

const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const ONE_MINUTE = 60 * 1000;

const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);
const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,credentials);

const aborter = AbortController.timeout(30 * ONE_MINUTE);


module.exports = {
  credentials,
  blobServiceClient,
  aborter,
  STORAGE_ACCOUNT_NAME,
  ACCOUNT_ACCESS_KEY,
  ONE_MEGABYTE,
  ONE_MINUTE
}

