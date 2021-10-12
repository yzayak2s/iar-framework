const express = require('express');
const router = express.Router();

const authApi = require('../apis/auth-api')

router.post('/login', authApi.login);
router.delete('/login', authApi.logout);
router.get('/login', authApi.isLoggedIn);

module.exports = router;