const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');
 
async function Helper(tablename) {
  const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
  const blockBlobClient =  await functions.getblob(containerClient, tablename+".json");

  const data = await functions.downloadcontent(blockBlobClient, connect.aborter);
  return data;
}

const apiRouter = express.Router();

apiRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/json');
    next();
})
.post(urlencodedParser,(req,res)=>{
    console.log('post request');
    Helper(req.body.tablename).then((data) => {
        res.json(data);
    }).catch((e) => console.log(e));
})

module.exports = apiRouter;