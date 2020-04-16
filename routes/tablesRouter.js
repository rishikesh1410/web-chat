const express = require('express');
const bodyParser = require('body-parser');
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');
 
async function Helper() {
  const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
  const blobs =  await functions.getblobnames(connect.aborter, containerClient, "demo");
  tables = [];
  for await (const blob of blobs) {
    name = blob.name.replace(".json", "");
    tables.push(name);
  }
  const blockBlobClient =  await functions.getblob(containerClient, "iris.json");

  const content = await functions.downloadcontent(blockBlobClient, connect.aborter);
  return {tables,content};
}

const tablesRouter = express.Router();

tablesRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    Helper().then((data) => {
      console.log("----->");
      data.content = JSON.parse(data.content);
      res.render('tables', {'tables' : data.tables, 'content' : data.content, 'table' : 'iris'});
    }).catch((e) => console.log(e));
})

module.exports = tablesRouter;