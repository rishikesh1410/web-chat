const express = require('express');
const bodyParser = require('body-parser');

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

module.exports = registerRouter;