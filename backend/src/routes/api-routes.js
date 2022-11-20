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
router.post('/salesmen/create', checkAuthorization(), salesmenApi.addSalesman);
router.delete('/salesmen/delete/id/:_id', checkAuthorization(), salesmenApi.deleteSalesMan);

const evaRecApi = require('../apis/evaluation-record-api');
router.get('/evaluationRecords/read/all', checkAuthorization(), evaRecApi.getAllEvaluationRecords);
router.get('/evaluationRecords/read/id/:_id', checkAuthorization(), evaRecApi.getEvaluationRecordsById);
router.get('/evaluationRecords/read/salesmanId/:salesManID', checkAuthorization(), evaRecApi.getEvaluationRecordsOfSalesmanById);
router.post('/evaluationRecords/create', checkAuthorization(), evaRecApi.addEvaluationRecord);
router.put('/evaluationRecords/update/id/:_id', checkAuthorization(), evaRecApi.updateEvaluationRecordById);
router.delete('/evaluationRecords/delete/id/:_id', checkAuthorization(), evaRecApi.deleteEvaluationRecord);
router.delete('/evaluationRecords/delete/salesmanId/:salesManID', checkAuthorization(), evaRecApi.deleteAllEvaluationRecordsOfSalesmanById);

module.exports = router;