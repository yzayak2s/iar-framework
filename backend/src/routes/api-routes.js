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

// Add checkAuthorization as middleware
router.use(checkAuthorization());

const userApi = require('../apis/user-api');
router.get('/user', userApi.getSelf);

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
router.get('/salesmen/read/all', salesmenApi.getSalesmen);

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
router.get('/salesmen/read/firstname/:firstname', salesmenApi.getSalesManByFirstname);
router.get('/salesmen/read/id/:_id', salesmenApi.getSalesManById);
router.post('/salesmen/create', salesmenApi.addSalesman);
router.put('/salesmen/update/:_id', salesmenApi.updateSalesManById);
router.delete('/salesmen/delete/id/:_id', salesmenApi.deleteSalesMan);

const evaRecApi = require('../apis/evaluation-record-api');
router.get('/evaluationRecords/read/all', evaRecApi.getAllEvaluationRecords);
router.get('/evaluationRecords/read/id/:_id', evaRecApi.getEvaluationRecordsById);
router.get('/evaluationRecords/read/salesmanId/:salesManID', evaRecApi.getEvaluationRecordsOfSalesmanById);
router.post('/evaluationRecords/create', evaRecApi.addEvaluationRecord);
router.put('/evaluationRecords/update/id/:_id', evaRecApi.updateEvaluationRecordById);
router.delete('/evaluationRecords/delete/id/:_id', evaRecApi.deleteEvaluationRecord);
router.delete('/evaluationRecords/delete/salesmanId/:salesManID', evaRecApi.deleteAllEvaluationRecordsOfSalesmanById);

const bonusApi = require('../apis/bonus-api');
router.get('/bonuses/read/all', bonusApi.getBonuses);
router.get('/bonuses/read/id/:_id', bonusApi.getBonusById);
router.get('/bonuses/read/salesmanId/:salesManID', bonusApi.getBonusesOfSalesmanById);
router.post('/bonuses/create', bonusApi.addBonus);
router.put('/bonuses/update/id/:_id', bonusApi.updateBonusById);
router.delete('/bonuses/delete/id/:_id', bonusApi.deleteBonus);
router.delete('/bonuses/delete/salesmanId/:salesManID', bonusApi.deleteAllBonusesOfSalesmanById);

const openCRX = require('../apis/openCRX-api');
router.get('/accounts/read/all', openCRX.getAccounts);
router.get('/accounts/read/uid/:uid', openCRX.getAccountByUID);
router.get('/products/read/all', openCRX.getProducts);
router.get('/products/read/uid/:uid', openCRX.getProductByUID);
router.get('/salesOrders/read/all', openCRX.getSalesOrders);
router.get('/salesOrders/read/uid/:uid', openCRX.getSalesOrderByUID);
router.get('/salesOrders/:uid/positions/read/all', openCRX.getPositions);

const orangeHRM = require('../apis/orangeHRM-api')
router.get('/employees/read/all', orangeHRM.getEmployees);
router.get('/employees/id/:id', orangeHRM.getEmployeeById);
router.get('/employees/id/:id/bonussalary', orangeHRM.getBonusSalariesByEmployee)
router.post('/employees/id/:id/bonussalary', orangeHRM.addBonusSalary);

module.exports = router;