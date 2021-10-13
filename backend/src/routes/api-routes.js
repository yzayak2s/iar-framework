const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

const authApi = require('../apis/auth-api')
router.post('/login', authApi.login);
router.delete('/login', checkAuthorization(),authApi.logout);
router.get('/login', authApi.isLoggedIn);

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

module.exports = router;