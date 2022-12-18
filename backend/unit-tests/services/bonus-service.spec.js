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

const bonusExample1 = new Bonus(0, 2020, 2000, false, 0);
const bonusExample2 = new Bonus(1, 2021, 2555, true, 0);
const bonusExample3 = new Bonus(2, 2021, 1555, false, 1);

const salesmanExample1 = new SalesMan('Max', 'Mustermann', 0);
const salesmanExample2 = new SalesMan('John', 'Johny', 1)

let db;

describe("bonus-service Unit-tests", function() {
    before(async () => {
        db = await initMockedMongoDB();
    });

    afterEach(() => {
        resetMockedMongoDB();
    });

    after(() => {
        closeMockedMongoDB();
    });


    describe.only("Able to add bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));
        });

        it("Created three bonus", async function() {
            await expect(salesmanService.getAll(db)).to.eventually.be.an('array').with.lengthOf(2);

            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(0)
        });
    });
});