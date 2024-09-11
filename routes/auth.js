const express = require("express");
const { register, login,getMe, forgotPassword, resetPassword,updateDetails, updatePassword, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

router.route('/register').post(register);
console.log("in user router")
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(protect,getMe);
router.route('/update/:id').put(protect,updateDetails);
router.route('/updatePassword').put(protect,updatePassword);
router.route('/forgetpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports=router