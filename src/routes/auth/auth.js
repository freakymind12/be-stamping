// routes/auth.js
const express = require('express');
const authController = require('../../controllers/auth/auth.js')
const authMiddleware = require('../../middleware/auth.js')

const router = express.Router();

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);

router.post('/refresh', authMiddleware.validateRefreshToken, authController.refreshToken)

module.exports = router;
