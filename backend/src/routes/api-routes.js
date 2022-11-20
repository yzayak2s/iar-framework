const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(), authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

const salesmenApi = require('../apis/salesman-api');
router.get('/salesmen/read/all', checkAuthorization(), salesmenApi.getSalesmen);
router.get('/salesmen/read/firstname/:firstname', checkAuthorization(), salesmenApi.getSalesManByFirstname);
router.get('/salesmen/read/_id/:_id', checkAuthorization(), salesmenApi.getSalesManById);
router.post('/salesmen/create', checkAuthorization(), salesmenApi.addSalesman);
router.put('/salesmen/update/:_id', checkAuthorization(), salesmenApi.updateSalesManById);
router.delete('/salesmen/delete/_id/:_id', checkAuthorization(), salesmenApi.deleteSalesMan);

module.exports = router;