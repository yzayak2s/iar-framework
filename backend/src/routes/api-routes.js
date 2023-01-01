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

// Add checkAuthorization as middleware
router.use(checkAuthorization());

const userApi = require('../apis/user-api');
router.get('/user', userApi.getSelf);

const salesmenApi = require('../apis/salesman-api');
router.get('/salesmen/read/all', salesmenApi.getSalesmen);
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
router.get('/bonuses/calculateBonus/sid/:salesManID/:year', bonusApi.calculateBonus);
router.get('/bonuses/calculateBonus/all/:year', bonusApi.calculateAllBonus);
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
router.get('/employees/id/:id/bonussalary', orangeHRM.getBonusSalariesByEmployee);
router.post('/employees/id/:id/bonussalary', orangeHRM.addBonusSalary);

router.get('/salesmen/getApiSalesmen', salesmenApi.createApiSalesmen);

module.exports = router;