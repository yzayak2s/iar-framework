const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */
const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: Login
 *      tags:
 *          - Authentification
 *      requestBody:
 *          description: Login Details
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *                      required:
 *                          - username
 *                          - password
 *      responses:
 *          200:
 *              description: You are logged in!
 *          401:
 *              description: Login failed!
 */
router.post('/login', authApi.login); //the function decides which request type should be accepted
/**
 * @swagger
 * /api/login:
 *  delete:
 *      summary: Logout
 *      tags:
 *          - Authentification
 *      responses:
 *          200:
 *              description: You successfully logged out!
 *          401:
 *              description: You are not logged in!
 */
router.delete('/login', checkAuthorization(), authApi.logout); //middlewares can be defined in parameters
/**
 * @swagger
 * /api/login:
 *  get:
 *      summary: Check if currently logged in
 *      tags:
 *          - Authentification
 *      responses:
 *          200:
 *              description: You are logged in!
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              loggedIn:
 *                                  type: boolean
 *                                  description: true or false
 */
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

// TODO: Outsource endpoints in to separate files ( if possible)
const salesmenApi = require('../apis/salesman-api');

/**
 * @swagger
 * /api/salesmen/read/all:
 *  get:
 *      summary: Returns the list of all salesman
 *      tags:
 *          - Salesman
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
 *      tags:
 *          - Salesman
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

const openCRX = require('../apis/openCRX-api');
router.get('/accounts/read/all', checkAuthorization(), openCRX.getAccounts);
router.get('/accounts/read/uid/:uid', checkAuthorization(), openCRX.getAccountByUID);
router.get('/products/read/all', checkAuthorization(), openCRX.getProducts);
router.get('/products/read/uid/:uid', checkAuthorization(), openCRX.getProductByUID);
router.get('/salesOrders/read/all', checkAuthorization(), openCRX.getSalesOrders);
router.get('/salesOrders/read/uid/:uid', checkAuthorization(), openCRX.getSalesOrderByUID);

const orangeHRM = require('../apis/orangeHRM-api')
router.get('/employees/read/all', checkAuthorization(), orangeHRM.getEmployees);
router.get('/employees/code/:code', checkAuthorization(), orangeHRM.getEmployeeByCode);
router.get('/employees/code/:code/bonussalary', checkAuthorization(), orangeHRM.getBonusSalariesByEmployee)

module.exports = router;