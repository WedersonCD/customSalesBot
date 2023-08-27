const express = require('express')
const router = express.Router();

const smartBotController = require('../controllers/smartBotController');


router.post('/createChat',smartBotController.createChat)

module.exports = router;