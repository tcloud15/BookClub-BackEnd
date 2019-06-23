
process.on('unhandledRejection', (err) => {
    throw err
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const cors = require('cors');
const passportUtils = require('./passport');

module.exports = app;

app.use(cors());
//Passport Middleware
app.use(passport.initialize())

//Body Parser Middleware
app.use(bodyParser.json({ type: 'application/json', limit:'50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

const authRouter = require('../app-client/app-client.authRouter');
const clientRouter = require('../app-client/app-client.router');

app.use('/verify', authRouter);
app.use('/client', clientRouter);

//Starts server on port 4000
app.listen(4000, function () {
    console.log('Server started on Port 4000..');
});