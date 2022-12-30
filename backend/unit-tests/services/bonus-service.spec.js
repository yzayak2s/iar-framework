const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const bonusService = require('../../src/services/bonus-service');
const Bonus = require('../../src/models/Bonus');
const salesmanService = require('../../src/services/salesman-service');
const SalesMan = require('../../src/models/SalesMan');
const {copyObject} = require('../support/copyObject');
const openCRXService = require('../../src/services/openCRX-service');

const bonusExample1 = new Bonus(2020, 2000, 'Some remark1', false, 1);
const bonusExample2 = new Bonus(2021, 2555, 'Some remark2', true, 1);
const bonusExample3 = new Bonus(2021, 1555, 'Some remark3', false, 2);

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


    describe.only("Able to add bonuses", function() {
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
            const badBonus = new Bonus(2000, 9999, 'Some remark5', true, 9);
            await expect(bonusService.add(db, copyObject(badBonus))).to.eventually.be.rejectedWith('Salesman with id ' + badBonus.salesManID + ' does not exists!');
        });

        it('throws if given object is incorrect', async function() {
            // year missing
            await expect(bonusService.add(db, {value: 500, remark: 'yes', verified: 'yes', salesManID:1})).to.be.rejectedWith('Incorrect body object was provided. Needs year, value, remark, verified and salesManID.')
        });

        it('throws if bonus for a salesman for the specific year already exists', async function() {
            await bonusService.add(db, copyObject(bonusExample1));
            await expect(bonusService.add(db, copyObject(bonusExample1))).to.eventually.be.rejectedWith('Bonus for salesman ' + bonusExample1.salesManID + ' already exists for the year ' + bonusExample1.year + '.');
        });
    });

    describe("Able to update bonuses", function() {
        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            bonusID1 = await bonusService.add(db, copyObject(bonusExample1));
        });

        it("Updated correctly", async function() {
            await expect(bonusService.update(db, bonusID1, copyObject(bonusExample2))).to.eventually.be.fulfilled;
            await expect(bonusService.getBonusById(db, bonusID1)).to.eventually.eql({_id: bonusID1, year:  2021, value: 2555, remark: 'Some remark1', verified: true, salesManID: 1});
        });

        it("Throws if bonus does not exist", async function() {
            await expect(bonusService.update(db, 5, copyObject(bonusExample3))).to.eventually.be.rejectedWith(`Bonus with ID ${bonusExample3._id} doesn't exist!`)
        });
    });

    describe("Able to read bonuses", function() {
        let bonusID1;

        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));

            bonusID1 = await bonusService.add(db, copyObject(bonusExample1));
            await bonusService.add(db, copyObject(bonusExample2));
            await bonusService.add(db, copyObject(bonusExample3));
        });

        it("Able to get Bonuses by SalesmanID", async function() {
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.exist;
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.be.an('array').lengthOf(2);
            await expect(bonusService.getBonusBySalesmanID(db, 1)).to.eventually.excluding('_id').have.deep.members([bonusExample1, bonusExample2]);
        });

        it("Able to get all bonuses", async function() {
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(3);
            await expect(bonusService.getAll(db)).to.eventually.excluding('_id').have.deep.members([
                { year: 2020, value: 2000, remark: 'Some remark1', verified: false, salesManID: 1 },
                { year: 2021, value: 2555, remark: 'Some remark2', verified: true, salesManID: 1 },
                { year: 2021, value: 1555, remark: 'Some remark3', verified: false, salesManID: 2 }
              ]);
        });

        it("Able to get Bonus by ID", async function() {
            await expect(bonusService.getBonusById(db, bonusID1)).to.eventually.exist;
            await expect(bonusService.getBonusById(db, bonusID1)).to.eventually.be.an('object');
            await expect(bonusService.getBonusById(db, bonusID1)).to.eventually.excluding('_id').eql(bonusExample1);
        });
    });

    describe("Able to delete Bonuses", function() {
        let bonusID3;

        beforeEach(async () => {
            await salesmanService.add(db, copyObject(salesmanExample1));
            await salesmanService.add(db, copyObject(salesmanExample2));

            await bonusService.add(db, copyObject(bonusExample1));
            await bonusService.add(db, copyObject(bonusExample2));
            bonusID3 = await bonusService.add(db, copyObject(bonusExample3));
        });

        it("Able to delete single bonus by ID", async function() {
            await expect(bonusService.delete(db, bonusID3)).to.eventually.be.fulfilled;
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').lengthOf(2).with.excluding('_id').deep.members([bonusExample1, bonusExample2]);
        });

        it("Throws if trying to delete non existing bonus by ID", async function() {
            await expect(bonusService.delete(db, 9)).to.eventually.be.rejectedWith("Bonus with ID 9 doesn't exist!");
        });

        it("Able to delete all bonuses of a salesman", async function() {
            await expect(bonusService.deleteBySalesManID(db, 1)).to.eventually.be.fulfilled;
            await expect(bonusService.getAll(db)).to.eventually.be.an('array').with.lengthOf(1).which.excluding('_id').eql([bonusExample3]);
        });

        it("Throws if trying to delete bonuses from non existing salesman", async function() {
            await expect(bonusService.deleteBySalesManID(db, 9)).to.eventually.be.rejectedWith("Salesman wit id 9 doesn't exist!")
        });
    });

    describe('Able to calculate Bonus', function() {
        beforeEach(() => {
            sinon.stub(openCRXService, 'getSalesOrdersBySalesRepUID').resolves(
                {
                    contractType: 'SalesOrder',
                    salesOrderUID: 'RPI8V9YPYA8Z07IGMO3WKDQ7W',
                    customerUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
                    salesRep: '9ENFSDRCBESBTH2MA4T2TYJFL',
                    createdAt: '2022',
                    priority: 2,
                    contractNumber: 1337,
                    totalTaxAmount: '733.125000000',
                    totalBaseAmount: '8625.000000000',
                    totalAmountIncludingTax: '9358.125000000'
                }
              );

            sinon.stub(openCRXService, 'getAccountByUID').resolves(
                {
                accountType: 'LegalEntity',
                accountUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
                fullName: 'TEST GMBH',
                accountRating: 1,
                accountState: 1
              }
              );

            sinon.stub(openCRXService, 'getAllPositionsByUID').resolves([
                {
                  contractType: 'SalesOrderPosition',      
                  positionUID: '3CZN0GINLXPT60EBHQA5MAZ7J',
                  productUID: '9JMBMVTX2CSMHH2MA4T2TYJFL', 
                  quantity: '10.000000000',
                  pricePerUnit: '250.000000000',
                  amount: '2500.500000000000000000000000000'
                },
                {
                  contractType: 'SalesOrderPosition',
                  positionUID: '3N1IOFZVIDZAI0EBHQA5MAZ7J',
                  productUID: 'L6K68IE1QROBTH2MA4T2TYJFL',
                  quantity: '1.000000000',
                  pricePerUnit: '200.000000000',
                  amount: '2000.000000000000000000000000000'
                }
              ]);

            sinon.stub(openCRXService, 'getProductByUID').onFirstCall().resolves({
                productType: 'Product',
                productUID: undefined,
                productNumber: 1001,
                name: 'TestProduct1',
                description: 'Test Product 1'
              }).onSecondCall().resolves({
                productType: 'Product',
                productUID: undefined,
                productNumber: 1002,
                name: 'TestProduct2',
                description: 'Test Product 2'
              });
        });

        afterEach(() => {
            sinon.restore();
        })

        describe('Calculate Bonus for all Salesman', function() {
            beforeEach(async () => {
                await salesmanService.add(db, copyObject(salesmanExample1));
                await salesmanService.add(db, copyObject(salesmanExample2));
            });
        });

        describe('Calculate Bonus for a single Salesman', function() {
            beforeEach(async () => {
                await salesmanService.add(db, copyObject(salesmanExample1));
            });

            it("")
        });
    });
});