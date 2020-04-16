const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');

async function Helper(tablename) {
    const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
    functions.uploadlocalfile(connect.aborter, containerClient, "./database/users.json");
    return;
}

const registerRouter = express.Router();

registerRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('register');
})
.post(urlencodedParser,(req,res)=>{
    var name=req.body.firstname + " " + req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var users = require('../database/users.json');
    users.users.push({
        name : name,
        email : email,
        password : password
    });
    var json = JSON.stringify(users);
    fs.writeFile('./database/users.json', json, 'utf8', function(err){
        if(err) console.log(err);
    });
    Helper().then(()=>{
        console.log("Success");
        res.redirect('/login');
    }).catch((e)=> console.log(e));

    
})
module.exports = registerRouter;