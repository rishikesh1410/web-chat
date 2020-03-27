const express = require('express');
const bodyParser = require('body-parser');
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');
 
async function Helper(tablename) {
  const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
  const blockBlobClient =  await functions.getblob(containerClient, tablename+".json");

  const data = await functions.downloadcontent(blockBlobClient, connect.aborter);
  return data;
}

const chartsRouter = express.Router(); 

chartsRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('charts');
});


chartsRouter.route('/:tablename')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    Helper(req.params.tablename).then((data) => {
        table = JSON.parse(data);
        res.render('charts', {'tablename' : req.params.tablename, 'columns' : table[0]});
    }).catch((e) => console.log(e));
})
module.exports = chartsRouter;