const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const salesmanService = require('../../src/services/salesman-service');
const SalesMan = require('../../src/models/SalesMan');
const {copyObject} = require('../support/copyObject')

const salesMan = new SalesMan('Wilhelm', 'Schwarz', 1)
const salesMan2 = new SalesMan('Jane', 'Samuel', 2)
const salesMan3 = new SalesMan('Karl', 'Lauterbach', 1)

let db;

describe('salesman-service unit-tests', function() {
    before(async function() {
        db = await initMockedMongoDB();
    });
    afterEach(function() {
        resetMockedMongoDB(db);
    });
    after(function() {
        closeMockedMongoDB(db);
    });

    describe('salesman creation tests', function() {
        it('insert salesman to db', async function(){
            await salesmanService.add(db, copyObject(salesMan))
            await expect(db.collection('salesmen').findOne()).to.eventually.excluding('_id').be.eqls(salesMan)
        });

        it('expect correct objectId to be returned', async function() {
            const sid = await salesmanService.add(db, copyObject(salesMan));
            await expect(db.collection('salesmen').findOne()).to.eventually.have.property('_id', sid);
        });
    });

    describe('salesman lookup tests', function(){
        it('expect correct salesman to found', async function(){
            await db.collection('salesmen').insert([salesMan, salesMan2]);
            await expect(salesmanService.getSalesManByFirstname(db, salesMan.firstname)).to.eventually.be.eqls(salesMan);
        });

        it('expect null when salesman not found', async function() {
            await expect(salesmanService.getSalesManByFirstname(db, 'firstname')).to.eventually.be.null;
        })
    });

    describe('salesman actualisation tests', function(){
        it('update salesman in db', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await salesmanService.update(db, salesMan._id, copyObject(salesMan3));
            await expect(db.collection('salesmen').findOne()).to.eventually.be.eqls(salesMan3);
        });
    });
})