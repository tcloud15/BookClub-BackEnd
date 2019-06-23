const { query } = require('../db/db-module');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const PORTAL_SECRET = 'portal_jwt_secret';
const APP_SECRET = 'super_secret_needs_to_come_from_settings';

module.exports = {
    register,
    login,
}

async function register(req, res) {
    var sqlRegister = 'SELECT * FROM Member WHERE uname = ?';

    const reg = (await query(sqlRegister, req.body.uname));
    console.log(reg);
    if(reg.length != 0 ) {
        return res.json(false);
    } else {
        //email verification
        if (req.body.email.includes(" ") || !(req.body.email.includes("@")) || !(req.body.email.includes(".com")
            || !(req.body.email.includes(".edu")) || !(req.body.email.includes(".org")))) {
            return res.json({
                errors: ['Your email did not meet the requirements, try again.']
            });
        }
        else {
            var verifiedEmail = req.body.email;
        }

        //password verification
        if (req.body.password.includes(" ") || req.body.password.length < 3 || req.body.password.length > 18) {
            return res.json({
                errors: ['Your password did not meet the requirements, try again.']
            });
        }
        else {
          var sqlEmail = 'Select * from Member where email = ?';
          const em = (await query (sqlEmail, req.body.email));
          console.log(em);
          if(em.length != 0) {
            return res.json({ errors: ['This email has already been used. Please choose a different email.']});
          } else {
            var salt = crypto.randomBytes(16).toString('hex');
            var hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'SHA512').toString('hex');
          }
        }

        var sqlRegister = 'INSERT INTO Member (uname, pw_hash, email, salt, major, phone, name) VALUES (?,?,?,?,?,?,?)';


        //Insert data from the POST body
        var dataRegister = [
            req.body.uname,
            hashedPassword,
            verifiedEmail,
            salt,
            req.body.major,
            req.body.phone,
            req.body.name
        ];

        const register = (await query(sqlRegister, dataRegister));

        var sqlMember = 'SELECT * FROM Member where email=?';
        const Member = (await query(sqlMember, [verifiedEmail]));

        // The request went through and returns a json object of the client profile
        res.statusCode = 200;
        return res.json(Member);
    }
}

async function login(req, res) {
    //get user profile from the passport middleware
    var Member = req.user;
    console.log("Member in login: " + Member);

    // generate a signed json web token with the contents of user object and return it in the response
    const token = generateToken(Member);
    console.log({ Member, token });
    return res.json({ Member, token });
}

//function to generate a profile-specific token with a 7 day lifespan
function generateToken(Member) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        uname: Member.uname,
        email: Member.email,
        exp: parseInt(expiry.getTime() / 1000)
    }, APP_SECRET);
}
