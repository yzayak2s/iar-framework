const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');
const {copyObject} = require('../support/copyObject')

const bonusService = require('../../src/services/bonus-service');
const bonus = require('../../src/models/Bonus');
const salesmanService = require('../../src/services/salesman-service');
const salesman = require('../../src/models/SalesMan');
const SalesMan = require('../../src/models/SalesMan');
const Bonus = require('../../src/models/Bonus');

const bonusExample1 = new Bonus(0, 2020, 2000, false, 0);
const bonusExample2 = new Bonus(1, 2021, 2555, true, 0);
const bonusExample3 = new Bonus(2, 2021, 1555, false, 1);

describe.only('bonus-service unit-tests', function() {
    let db;

    before(async () => {
        db = await initMockedMongoDB();
    });

    after(() => {
        closeMockedMongoDB();
    });

    afterEach(() => {
        resetMockedMongoDB(db);
    });

    beforeEach(() => {
        salesmanService.add(db, new SalesMan('Max', 'Mustermann', 0));
        salesmanService.add(db, new SalesMan('John', 'Johny', 1));
    });

    describe("get All Bonus", async function() {
        await bonusService.add(db, copyObject(bonusExample1));
        await bonusService.add(db, copyObject(bonusExample2));
        await bonusService.add(db, copyObject(bonusExample3));

        const response = bonusService.getAll();

        it("Is an array with length 3", async function() {
            await expect(response).to.eventually.be.an('array').lengthOf(3);
        });

        it("Got the correct bonuses", async function() {
            await expect(response).to.eventually.have.members([bonusExample1, bonusExample2, bonusExample3]);
        });

    });
});