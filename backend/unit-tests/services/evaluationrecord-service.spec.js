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

    describe('evaluation record creation tests', function() {
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

        it('expect error if salesman does not exist', async function() {
            await expect(evaluationRecordService.add(db, copyObject(evaluationRecord))).to.be.rejectedWith('Salesman with id 1 does not exist!');
        });

        it('expect error if record id already exists', async function() {
            await salesmanService.add(db, copyObject(salesMan))
            const _goalID = await evaluationRecordService.add(db, copyObject(evaluationRecord));

            await expect(evaluationRecordService.add(db, copyObject(evaluationRecord))).to.be.rejectedWith('EvaluationRecord with id ' + _goalID + ' already exists!');
        });
    });

    describe('evaluation record lookup tests', function () {
        it('expect correct evaluation-record to be found', async function () {
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

        it('expect list of all evaluation records', async function() {
            await db.collection('salesmen').insert([salesMan,salesMan2]);
            await db.collection('evaluation_record').insert([
                evaluationRecord,
                evaluationRecord2,
                evaluationRecord3
            ]);

            await expect(evaluationRecordService.getAll(db)).to.eventually.be.eqls([evaluationRecord, evaluationRecord2, evaluationRecord3]);
        });

        it('expect evaluation record of id 1', async function() {
            await db.collection('salesmen').insert([salesMan,salesMan2]);
            await db.collection('evaluation_record').insert([
                evaluationRecord,
                evaluationRecord2,
                evaluationRecord3
            ]);

            await expect(evaluationRecordService.getById(db, 1)).to.eventually.be.eql(evaluationRecord);
        });
    });

    describe('evaluation record update tests', function () {
        it('update evaluation-record with id', async function () {
            await salesmanService.add(db, copyObject(salesMan));
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.updateById(db, evaluationRecord._id, copyObject(evaluationRecord3));
            await expect(db.collection('evaluation_record').findOne()).to.eventually.excluding(['_id']).be.eqls(evaluationRecord3);
        });

        it('trying to update not existing record', async function () {
            await expect(evaluationRecordService.updateById(db, 0, copyObject(evaluationRecord3))).to.be.rejectedWith('No EvaluationRecord with id 0 exists!');
        });
    });

    describe('evaluation record delete tests', function () {
        it('delete record by id works', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await evaluationRecordService.add(db, copyObject(evaluationRecord));

            await expect(evaluationRecordService.getById(db, 1)).to.eventually.be.eql(evaluationRecord);
            await expect(evaluationRecordService.delete(db, 1)).to.eventually.be.fulfilled;
            await expect(evaluationRecordService.getById(db, 1)).to.eventually.be.null;
        });

        it('delete not existing record by id throws', async function(){
            await expect(evaluationRecordService.delete(db, 1)).to.be.rejectedWith("EvaluationRecord with id 1 doesn't exist!");
        });
        
        it('delete record by salesmanID works', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await evaluationRecordService.add(db, copyObject(evaluationRecord));
            await evaluationRecordService.add(db, copyObject(evaluationRecord3));

            await expect(evaluationRecordService.getBySalesmanID(db, 1)).to.eventually.be.eqls([evaluationRecord, evaluationRecord3]);
            await expect(evaluationRecordService.deleteBySalesmanID(db, 1)).to.eventually.be.fulfilled;
            await expect(evaluationRecordService.getBySalesmanID(db, 1)).to.eventually.be.eql([]);
        });

        it('delete records by SalesmanId throws if salesman does not exist', async function(){
            await expect(evaluationRecordService.deleteBySalesmanID(db, 1)).to.be.rejectedWith('Salesman with id 1 does not exist!');
        });
    });
});