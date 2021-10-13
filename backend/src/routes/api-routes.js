const express = require('express');
const router = express.Router();

const authApi = require('../apis/auth-api')
router.post('/login', authApi.login);
router.delete('/login', authApi.logout);
router.get('/login', authApi.isLoggedIn);

const userApi = require('../apis/user-api');
router.get('/user', userApi.getSelf);

module.exports = router;