const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('./app-client.authentication');

module.exports = router;

router.put('/register', authController.register);
router.put('/login', passport.authenticate('local', { session: false }), authController.login);