const { query } = require('../db/db-module');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const KEY = 'super_secret_needs_to_come_from_settings'

module.exports = {
    extractJWTToRequest
}

//Strategy for verifying login credentials
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, done) {
        var sql = 'SELECT * FROM Member WHERE email=?';

        //grabs Member profile from database if there is an email to match
        const Member = (await query(sql, [email]));

        var dbHash = Member[0].pw_hash;
        console.log(Member[0]);
        console.log("dbhash: " + dbHash);
        console.log("salt: " + Member[0].salt);

        //creates a new hashed password from the plain text password given at login
        var newHash = crypto.pbkdf2Sync(password, Member[0].salt, 1000, 64, 'SHA512').toString('hex');
        console.log("newHash: " + newHash);

        //compares stored hash password with newly hashed password
        if (dbHash === newHash) {
            return done(null, Member[0], { message: 'Logged In Successfully' });
        }
        else {
            console.log('did not match');
            return done(null, false, { message: 'Incorrect email or password.' });
        }
    }
));

//strategy that allows only client requests with valid tokens to access routes needing auth
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromBodyField('auth_token'),
    secretOrKey: KEY
},
    function (jwtPayload, callback) {

        //find the user in db if needed
        return query('SELECT * FROM Member WHERE email=?', [jwtPayload.email])
            .then(Member => {
                return callback(null, Member[0]);
            })
            .catch(err => {
                console.log('erroring out in jwt');

                return callback(err);
            });
    }
));

function extractJWTToRequest(req, res, next) {
    if (req.body.auth_token) {
        try {
            const pieces = jwt.verify(req.body.auth_token, KEY)
            req.jwtInfo = pieces
            return next()
        }
        catch (e) {

        }
    }
}
