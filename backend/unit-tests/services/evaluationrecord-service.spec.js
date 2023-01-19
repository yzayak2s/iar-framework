const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const evaluationRecordService = require('../../src/services/evaluation-record-service');
const EvaluationRecord = require('../../src/models/EvaluationRecord');
const {copyObject} = require('../support/copyObject')

const evaluationRecord = new EvaluationRecord('Some description', 4, 5, 2022, 1);
const evaluationRecord2 = new EvaluationRecord('Some description 2', 3, 1, 2023, 2);
const evaluationRecord3 = new EvaluationRecord('Some description 3', 4, 3, 2021, 1);

const salesmanService = require('../../src/services/salesman-service');
const SalesMan = require('../../src/models/SalesMan');

const salesMan = new SalesMan('Wilhelm', '', 'Schwarz', 'Wilhelm Schwarz', 'Sales', 'Senior Salesman', 1)
const salesMan2 = new SalesMan('Jane', '', 'Samuel', 'Jane Samuel', 'Sales', 'Senior Salesman', 2)

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

    describe('evaluation record creation tests', function() {
        it('insert evaluation-record to db', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            const recordID = await evaluationRecordService.add(db, copyObject(evaluationRecord));

            await expect(evaluationRecordService.getById(db, recordID)).to.eventually.excluding('_id').be.eqls(evaluationRecord);
        });

        it('expect correct objectId to be returned', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            const _goalID = await evaluationRecordService.add(db, copyObject(evaluationRecord));

            await expect(evaluationRecordService.getById(db, _goalID)).to.eventually.have.property('_id', _goalID);
        });

        it('expect error if salesman does not exist', async function() {
            await expect(evaluationRecordService.add(db, copyObject(evaluationRecord))).to.be.rejectedWith('Salesman with id 1 does not exist!');
        });

        it('throws if given object is incorrect', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            // targetValue missing
            await expect(evaluationRecordService.add(db, {goalDescription: 'ttt', actualValue: 6, year: 2012, salesManID: 1})).to.be.rejectedWith('Incorrect body object was provided. Needs goalDescription, targetValue, actualValue, year and salesManID.')
        });
    });

    describe('evaluation record lookup tests', function () {
        beforeEach(async () => {
            await salesmanService.add(db, salesMan);
            await salesmanService.add(db, salesMan2);
        });

        it('expect correct evaluation-record to be found', async function () {
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.add(db, copyObject(evaluationRecord2));
            await evaluationRecordService.add(db, copyObject(evaluationRecord3));

            await expect(evaluationRecordService.getBySalesmanID(db, evaluationRecord.salesManID)).to.eventually.excluding('_id').be.eqls([evaluationRecord, evaluationRecord3])
        });

        it('expect empty array ([]) when no records exist', async function () {
            await expect(evaluationRecordService.getBySalesmanID(db, 'salesManID')).to.eventually.be.eqls([]);
        });

        it('expect list of all evaluation records', async function() {
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.add(db, copyObject(evaluationRecord2));
            await evaluationRecordService.add(db, copyObject(evaluationRecord3));

            await expect(evaluationRecordService.getAll(db)).to.eventually.excluding('_id').be.eqls([evaluationRecord, evaluationRecord2, evaluationRecord3]);
        });

        it('expect correct evaluation record by id', async function() {
            const recordID = await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.add(db, copyObject(evaluationRecord2));
            await evaluationRecordService.add(db, copyObject(evaluationRecord3));

            await expect(evaluationRecordService.getById(db, recordID)).to.eventually.excluding('_id').be.eql(evaluationRecord);
        });
    });

    describe('evaluation record update tests', function () {
        it('update evaluation-record with id', async function () {
            await salesmanService.add(db, copyObject(salesMan));
            const recordID = await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.updateById(db, recordID, copyObject(evaluationRecord3));
            await expect(evaluationRecordService.getById(db, recordID)).to.eventually.excluding(['_id']).be.eqls(evaluationRecord3);
        });

        it('trying to update not existing record', async function () {
            await expect(evaluationRecordService.updateById(db, 0, copyObject(evaluationRecord3))).to.be.rejectedWith('No EvaluationRecord with id 0 exists!');
        });
    });

    describe('evaluation record delete tests', function () {
        it('delete record by id works', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            const recordID = await evaluationRecordService.add(db, copyObject(evaluationRecord));

            await expect(evaluationRecordService.getById(db, recordID)).to.eventually.excluding('_id').be.eql(evaluationRecord);
            await expect(evaluationRecordService.delete(db, recordID)).to.eventually.be.fulfilled;
            await expect(evaluationRecordService.getById(db, recordID)).to.eventually.be.null;
        });

        it('delete not existing record by id throws', async function(){
            await expect(evaluationRecordService.delete(db, 1)).to.be.rejectedWith("EvaluationRecord with id 1 doesn't exist!");
        });
        
        it('delete record by salesmanID works', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.add(db, copyObject(evaluationRecord3));

            await expect(evaluationRecordService.getBySalesmanID(db, 1)).to.eventually.be.excluding('_id').eqls([evaluationRecord, evaluationRecord3]);
            await expect(evaluationRecordService.deleteBySalesmanID(db, 1)).to.eventually.be.fulfilled;
            await expect(evaluationRecordService.getBySalesmanID(db, 1)).to.eventually.be.eql([]);
        });

        it('delete records by SalesmanId throws if salesman does not exist', async function(){
            await expect(evaluationRecordService.deleteBySalesmanID(db, 1)).to.be.rejectedWith('Salesman with id 1 does not exist!');
        });
    });
});