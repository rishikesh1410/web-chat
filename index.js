const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const passportSetup = require('./config/passport-config');
const keys = require('./config/keys');


const host = 'localhost';
const port = 8080;

const homeRouter = require('./routes/homeRouter');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const mainRouter = require('./routes/mainRouter');
const tablesRouter = require('./routes/tablesRouter');
const chartsRouter = require('./routes/chartsRouter');
const apiRouter = require('./routes/apiRouter');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/main', mainRouter);
app.use('/tables', tablesRouter);
app.use('/charts', chartsRouter);
app.use('/api', apiRouter);
app.get('/connect', (req,res)=>{
    require('./blobconnection/create');
    res.send('Azure blob is connected');
})
app.get('/logout', (req,res)=>{
    res.redirect('/');
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});