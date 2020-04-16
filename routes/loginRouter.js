const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const loginRouter = express.Router();

loginRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res)=>{
    res.render('login');
})
.post(urlencodedParser, passport.authenticate('local', { failureRedirect: '/login' }),
function(req, res) {
    res.redirect('/main');
});
module.exports = loginRouter;