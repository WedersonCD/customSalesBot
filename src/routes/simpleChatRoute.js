const express = require('express')
const router = express.Router();


const simpleChatView = require('../views/simpleChatView');
router.get('/',simpleChatView.getSimpleChat)

module.exports = router;