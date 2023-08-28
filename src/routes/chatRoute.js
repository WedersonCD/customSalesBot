const express = require('express')
const router = express.Router();

const chatController = require('../controllers/chatController');


router.post('/createChat',chatController.createChat)
router.get('/chat',chatController.getChat)
router.post('/sendChatMessage',chatController.sendChatMessage)
router.get('/recommendedGroupedProduct',chatController.getRecommendedGroupedProduct)



module.exports = router;