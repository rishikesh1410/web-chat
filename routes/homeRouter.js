const express = require('express');
const bodyParser = require('body-parser');

const homeRouter = express.Router();

homeRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('home');
})

module.exports = homeRouter;