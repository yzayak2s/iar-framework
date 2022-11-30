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
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await expect(db.collection('evaluation_record').findOne()).to.eventually.excluding('_id').be.eqls(evaluationRecord);
        });
    });
});