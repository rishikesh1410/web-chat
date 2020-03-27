const express = require('express');
const bodyParser = require('body-parser');

const mainRouter = express.Router();

mainRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    console.log(req.user.email);
    res.render('main', {'user': req.user.email});
})

module.exports = mainRouter;