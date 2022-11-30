const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const evaluationRecordService = require('../../src/services/evaluation-record-service');
const EvaluationRecord = require('../../src/models/EvaluationRecord');
const {copyObject} = require('../support/copyObject')

const evaluationRecord = new EvaluationRecord(1, 'Some description', 4, 5, 2022, 1);
const evaluationRecord2 = new EvaluationRecord(2, 'Some description 2', 3, 1, 2023, 2);
const evaluationRecord3 = new EvaluationRecord(3, 'Some description 3', 4, 3, 2021, 1);

const salesmanService = require('../../src/services/salesman-service');
const SalesMan = require('../../src/models/SalesMan');

const salesMan = new SalesMan('Wilhelm', 'Schwarz', 1)
const salesMan2 = new SalesMan('Hans', 'Peter', 2)

let db;

describe('evaluation-record-service unit-tests', function () {
    before(async function() {
        db = await initMockedMongoDB();
    });
    afterEach(function() {
        resetMockedMongoDB(db);
    });
    after(function() {
        closeMockedMongoDB(db);
    });

    describe('evaluation-record creation tests', function() {
        it('insert evaluation-record to db', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await expect(db.collection('evaluation_record').findOne()).to.eventually.be.eqls(evaluationRecord);
        });

        it('expect correct objectId to be returned', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            const _goalID = await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await expect(db.collection('evaluation_record').findOne()).to.eventually.have.property('_id', _goalID);
        });
    });

    describe('evaluation-record lookup tests', function () {
        it('expect correct evaluation-record to found', async function () {
            await db.collection('salesmen').insert([salesMan,salesMan2]);
            await db.collection('evaluation_record').insert([
                evaluationRecord,
                evaluationRecord2,
                evaluationRecord3
            ]);
            await expect(evaluationRecordService.getBySalesmanID(db, evaluationRecord.salesManID)).to.eventually.be.eqls([evaluationRecord, evaluationRecord3])
        });

        it('expect empty array ([]) when evaluation-record not found', async function () {
            await expect(evaluationRecordService.getBySalesmanID(db, 'salesManID')).to.eventually.be.eqls([]);
        });
    });

    describe('evaluation-record actualisation tests', function () {
        it('update evaluation-record in db', async function () {
            await salesmanService.add(db, copyObject(salesMan));
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.updateById(db, evaluationRecord._id, copyObject(evaluationRecord3));
            await expect(db.collection('evaluation_record').findOne()).to.eventually.excluding(['_id']).be.eqls(evaluationRecord3);
        });
    });
});