const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const bonusService = require('../../src/services/bonus-service');
const Bonus = require('../../src/models/Bonus');
const salesmanService = require('../../src/services/salesman-service');
const SalesMan = require('../../src/models/SalesMan');
const {copyObject} = require('../support/copyObject');

const bonusExample1 = new Bonus(1, 2020, 2000, 'Some remark1', false, 1);
const bonusExample2 = new Bonus(2, 2021, 2555, 'Some remark2', true, 1);
const bonusExample3 = new Bonus(3, 2021, 1555, 'Some remark3', false, 2);

const salesmanExample1 = new SalesMan('Max', 'Mustermann', 1);
const salesmanExample2 = new SalesMan('John', 'Johny', 2);

let db;

describe("bonus-service Unit-tests", function() {
    before(async() => {
        db = await initMockedMongoDB();
    });

    afterEach(() => {
        resetMockedMongoDB(db);
    });

    after(() => {
        closeMockedMongoDB(db);
    });


    describe("Able to add bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));
        });

        it("Can create Bonuses", async function() {
            await expect(bonusService.add(db, copyObject(bonusExample1))).to.eventually.be.fulfilled;
            await expect(bonusService.add(db, copyObject(bonusExample2))).to.eventually.be.fulfilled;
            await expect(bonusService.add(db, copyObject(bonusExample3))).to.eventually.be.fulfilled;

            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(3);
        });

        it("Throws if salesman does not exist", async function() {
            const badBonus = new Bonus(5, 2000, 9999, 'Some remark5', true, 9);
            await expect(bonusService.add(db, copyObject(badBonus))).to.eventually.be.rejectedWith('Salesman with id ' + badBonus.salesManID + ' does not exists!');
        });

        it("Throws if bonus id is already used", async function() {
            await bonusService.add(db, copyObject(bonusExample1));
            await expect(bonusService.add(db, copyObject(bonusExample1))).to.eventually.be.rejectedWith('Bonus with id ' + bonusExample1._id + ' already exists!');
        });

        it('throws if given object is incorrect', async function() {
            // id should be _id
            await expect(bonusService.add(db, {_id: 5, year: 2012, value: 500, remark: 'yes', verified: 'yes', salesManID:1})).to.be.rejectedWith('Incorrect body object was provided. Needs _id, year, value, remark, verified and salesManID.')
        });
    });

    describe("Able to update bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await bonusService.add(db, copyObject(bonusExample1));
        });

        it("Updated correctly", async function() {
            await expect(bonusService.update(db, 1, copyObject(bonusExample2))).to.eventually.be.fulfilled;
            await expect(bonusService.getBonusById(db, 1)).to.eventually.eql({_id: 1, year:  2021, value: 2555, remark: 'Some remark1', verified: true, salesManID: 1});
        });

        it("Throws if bonus does not exist", async function() {
            await expect(bonusService.update(db, 5, copyObject(bonusExample3))).to.eventually.be.rejectedWith(`Bonus with ID ${bonusExample3._id} doesn't exist!`)
        });
    });

    describe("Able to read bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));

            await bonusService.add(db, copyObject(bonusExample1));
            await bonusService.add(db, copyObject(bonusExample2));
            await bonusService.add(db, copyObject(bonusExample3));
        });

        it("Able to get Bonuses by SalesmanID", async function() {
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.exist;
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.be.an('array').lengthOf(2);
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.have.deep.members([bonusExample1, bonusExample2]);
        });

        it("Able to get all bonuses", async function() {
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(3);
            await expect(bonusService.getAll(db)).to.eventually.have.deep.members([
                { _id: 1, year: 2020, value: 2000, remark: 'Some remark1', verified: false, salesManID: 1 },
                { _id: 2, year: 2021, value: 2555, remark: 'Some remark2', verified: true, salesManID: 1 },
                { _id: 3, year: 2021, value: 1555, remark: 'Some remark3', verified: false, salesManID: 2 }
              ]);
        });

        it("Able to get Bonus by ID", async function() {
            await expect(bonusService.getBonusById(db, 1)).to.eventually.exist;
            await expect(bonusService.getBonusById(db, 1)).to.eventually.be.an('object');
            await expect(bonusService.getBonusById(db, 1)).to.eventually.eql(bonusExample1);
        });
    });

    describe("Able to delete Bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));

            await bonusService.add(db, copyObject(bonusExample1));
            await bonusService.add(db, copyObject(bonusExample2));
            await bonusService.add(db, copyObject(bonusExample3));
        });

        it("Able to delete single bonus by ID", async function() {
            await expect(bonusService.delete(db, 3)).to.eventually.be.fulfilled;
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(2).with.deep.members([bonusExample1, bonusExample2]);
        });

        it("Throws if trying to delete non existing bonus by ID", async function() {
            await expect(bonusService.delete(db, 9)).to.eventually.be.rejectedWith("Bonus with ID 9 doesn't exist!");
        });

        it("Able to delete all bonuses of a salesman", async function() {
            await expect(bonusService.deleteBySalesManID(db, 1)).to.eventually.be.fulfilled;
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').with.lengthOf(1).which.eql([bonusExample3]);
        });

        it("Throws if trying to delete bonuses from non existing salesman", async function() {
            await expect(bonusService.deleteBySalesManID(db, 9)).to.eventually.be.rejectedWith("Salesman wit id 9 doesn't exist!")
        });
    })
});