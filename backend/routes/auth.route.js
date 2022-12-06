const express = require('express');
const  authtController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/bal', authtController.dhon);
router.post("/login", authtController.login);
router.post("/logout", authtController.logout);
router.post("/register", authtController.register);

module.exports = router;