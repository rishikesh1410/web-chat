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
 
async function dataHelper(tablename) {
    const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
    const blobs =  await functions.getblobnames(connect.aborter, containerClient, "demo");
    tables = [];
    for await (const blob of blobs) {
      name = blob.name.replace(".json", "");
      tables.push(name);
    }
    const blockBlobClient =  await functions.getblob(containerClient, tablename+".json");
  
    const content = await functions.downloadcontent(blockBlobClient, connect.aborter);
    return {tables,content};
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
});

apiRouter.route('/:tablename')
.get((req,res)=>{
    console.log('get request');
    dataHelper(req.params.tablename).then((data) => {
      data.content = JSON.parse(data.content);
      res.render('tables', {'tables' : data.tables, 'content' : data.content, 'table' : req.params.tablename});
    }).catch((e) => console.log(e));
});

module.exports = apiRouter;