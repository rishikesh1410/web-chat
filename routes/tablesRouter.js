const express = require('express');
const bodyParser = require('body-parser');
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');
 
async function Helper() {
  const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
  const blockBlobClient =  await functions.getblob(containerClient, "tables.json");

  const data = await functions.downloadcontent(blockBlobClient, connect.aborter);
  return data;
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
        tables = JSON.parse(data);
        res.render('tables', {'tables' : tables.tables});
    }).catch((e) => console.log(e));
})

module.exports = tablesRouter;