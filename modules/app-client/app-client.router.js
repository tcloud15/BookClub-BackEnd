const express = require('express');
const router = express.Router();
const appClientController = require('./app-client.controller');

const app = express();
const passportUtils = require('../config/passport');
const passport = require('passport');
//passport middleware
app.use(passport.initialize())


module.exports = router;

router.put('/Book', appClientController.searchBook);
router.put('/Detail', appClientController.searchDetail);
router.put('/Create', appClientController.createBook);
router.put('/Memberbooks', appClientController.getMemberBooks);
router.put('/Delete', appClientController.deleteBook);
router.put('/Interested', [passport.authenticate('jwt',{ session: false }), passportUtils.extractJWTToRequest], appClientController.interested);
router.put('/MemberIntBooks', appClientController.memberInterestedBooks);
router.get('/All', appClientController.searchALlBooks);
router.put('/DeleteIntBook', appClientController.deleteIntBook);
router.put('/updatemajor', appClientController.updateMajor);
router.put('/updatename', appClientController.updateName);
router.put('/updatephonenum', appClientController.updatePhoneNum);
router.put('/updatepassword', appClientController.updatePassword)
router.put('/getmember', appClientController.getMember);
router.put('/getBookDetails', appClientController.getBookDetails);
router.put('/editBookDetails', appClientController.editBookDetails);
router.put('/count', appClientController.countInterested);
router.put('/getCount', appClientController.getCountInt);
router.put('/showIntUser', appClientController.showIntUser);
router.put('/updateCount', appClientController.updateCount);
router.put('/deleteaccount', appClientController.deleteaccount);
