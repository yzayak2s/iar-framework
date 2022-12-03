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

/**
 * @swagger
 * /api/salesmen/read/all:
 *  get:
 *      summary: Returns the list of all salesman
 *      responses:
 *          200:
 *              description: The list of salesman
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/SalesMan'
 *          401:
 *              description: Unauthorized 
 */
router.get('/salesmen/read/all', checkAuthorization(), salesmenApi.getSalesmen);

/**
 * @swagger
 * /api/salesmen/read/firstname/{firstname}:
 *  get: 
 *      summary: returns salesman with firstname
 *      parameters:
 *          - in: path
 *            name: firstname
 *            schema:
 *              type: string
 *            required: true
 *            description: First name of salesman
 *      responses:
 *          200:
 *              description: The salesman
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SalesMan'       
 *          401:
 *              description: Unauthorized 
 */
router.get('/salesmen/read/firstname/:firstname', checkAuthorization(), salesmenApi.getSalesManByFirstname);
router.get('/salesmen/read/id/:_id', checkAuthorization(), salesmenApi.getSalesManById);
router.post('/salesmen/create', checkAuthorization(), salesmenApi.addSalesman);
router.put('/salesmen/update/:_id', checkAuthorization(), salesmenApi.updateSalesManById);
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