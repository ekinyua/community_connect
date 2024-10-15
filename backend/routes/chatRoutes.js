const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/:userId', ensureAuthenticated, chatController.getMessages);
router.put('/:messageId/read', ensureAuthenticated, chatController.markAsRead);
router.post('/send', ensureAuthenticated, chatController.sendMessage);

module.exports = router;