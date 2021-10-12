const express = require('express');
const router = express.Router();

const authApi = require('../apis/auth-api')

router.post('/login', authApi.login);

module.exports = router;