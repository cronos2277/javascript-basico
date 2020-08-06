const express = require("express");
const router = express.Router();
const authentication = require('../controllers/authentication');
router.put("/",authentication.register);
router.post("/",authentication.login);

module.exports = router;