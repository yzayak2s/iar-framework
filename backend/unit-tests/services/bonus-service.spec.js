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
const evaluationRecordService = require('../../src/services/evaluation-record-service');
const bonus_comp_service = require('../../src/services/bonus-computation-service');
const EvaluationRecord = require('../../src/models/EvaluationRecord');

const bonusExample1 = new Bonus(2020, 2000, 'Some remark1', false, 1);
const bonusExample2 = new Bonus(2021, 2555, 'Some remark2', true, 1);
const bonusExample3 = new Bonus(2021, 1555, 'Some remark3', false, 2);

const salesmanExample1 = new SalesMan('Max', '', 'Mustermann', 'Max Mustermann', 'Sales', 'Senior Salesman', 1, '9ENFSDRCBESBTH2MA4T2TYJFL');
const salesmanExample2 = new SalesMan('John', '', 'Johny', 'John Johny', 'Sales', 'Senior Salesman', 2);
const salesmanExample3 = new SalesMan('Guy', '', 'Guyer', 'Guy Guyer', 'Sales', 'Senior Salesman', 3, '8DEIFGESH2MA4T2TYJSSFL');

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
            const badBonus = new Bonus(2000, 9999, 'Some remark5', true, 9);
            await expect(bonusService.add(db, copyObject(badBonus))).to.eventually.be.rejectedWith('Salesman with id ' + badBonus.salesManID + ' does not exists!');
        });

        it('throws if given object is incorrect', async function() {
            // year missing
            await expect(bonusService.add(db, {value: 500, remark: 'yes', verified: 'yes', salesManID:1})).to.be.rejectedWith('Incorrect body object was provided.')
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
            await expect(bonusService.getBonusById(db, bonusID1)).to.eventually.eql({_id: bonusID1, year:  2021, value: 2555, remark: 'Some remark1', verified: false, salesManID: 1});
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

    describe("Able to calculate Bonus", function() {
        const salesOrderExample1 = {
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
        };

        const salesOrderExample2 = {
            contractType: 'SalesOrder',
            salesOrderUID: 'RPI8V9YPYA8Z07IGMO3WKDQ7W',
            customerUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
            salesRep: '8DEIFGESH2MA4T2TYJSSFL',
            createdAt: '2022',
            priority: 2,
            contractNumber: 1337,
            totalTaxAmount: '733.125000000',
            totalBaseAmount: '8625.000000000',
            totalAmountIncludingTax: '9358.125000000'
        };

        const accountExample1 = {
            accountType: 'LegalEntity',
            accountUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
            fullName: 'TEST GMBH',
            accountRating: 1,
            accountState: 1
        };

        const accountExample2 = {
            accountType: 'LegalEntity',
            accountUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
            fullName: 'TEST GMBH 2',
            accountRating: 2,
            accountState: 1
        };

        const accountExample3 = {
            accountType: 'LegalEntity',
            accountUID: '9DXSJ5D62FBHLH2MA4T2TYJFL',
            fullName: 'TEST GMBH 3',
            accountRating: 3,
            accountState: 1
        };

        const positionExample1 = {
            contractType: 'SalesOrderPosition',      
            positionUID: '3CZN0GINLXPT60EBHQA5MAZ7J',
            productUID: '9JMBMVTX2CSMHH2MA4T2TYJFL', 
            quantity: '10.000000000',
            pricePerUnit: '250.000000000',
            amount: '2500.500000000000000000000000000'
        };

        const positionExample2 = {
            contractType: 'SalesOrderPosition',
            positionUID: '3N1IOFZVIDZAI0EBHQA5MAZ7J',
            productUID: 'L6K68IE1QROBTH2MA4T2TYJFL',
            quantity: '1.000000000',
            pricePerUnit: '200.000000000',
            amount: '2000.000000000000000000000000000'
        };

        const productExample1 = {
            productType: 'Product',
            productUID: '9JMBMVTX2CSMHH2MA4T2TYJFL',
            productNumber: 1001,
            name: 'TestProduct1',
            description: 'Test Product 1'
        };

        const productExample2 = {
            productType: 'Product',
            productUID: 'L6K68IE1QROBTH2MA4T2TYJFL',
            productNumber: 1002,
            name: 'TestProduct2',
            description: 'Test Product 2'
        };

        let getAccountStub, getSalesOrdersStub, getPositionsStub, getProductStub;

        beforeEach(() => {
            getSalesOrdersStub = sinon.stub(openCRXService, 'getSalesOrdersBySalesRepUID').withArgs('9ENFSDRCBESBTH2MA4T2TYJFL').resolves([salesOrderExample1]);
            getSalesOrdersStub.withArgs('8DEIFGESH2MA4T2TYJSSFL').resolves([salesOrderExample2])
            getAccountStub = sinon.stub(openCRXService, 'getAccountByUID').withArgs('9DXSJ5D62FBHLH2MA4T2TYJFL').resolves(accountExample1);
            getPositionsStub = sinon.stub(openCRXService, 'getAllPositionsByUID').withArgs('RPI8V9YPYA8Z07IGMO3WKDQ7W').resolves([positionExample1, positionExample2]);
            getProductStub = sinon.stub(openCRXService, 'getProductByUID').resolves(productExample1);
            getProductStub.onSecondCall().resolves(productExample2);
        });

        afterEach(() => {
            sinon.restore();
        })

        describe('Calculate Bonus for all Salesman', function() {
            let response;

            after(() => sinon.restore());

            beforeEach(async () => {
                await salesmanService.addWithUID(db, copyObject(salesmanExample1));
                await salesmanService.add(db, copyObject(salesmanExample2));
                await salesmanService.addWithUID(db, copyObject(salesmanExample3));

                response = bonusService.calculateAllBonus(db, salesOrderExample1.createdAt);
            });

            it("Returns array of Bonus Calculations", async function() {
                const result = await response;

                expect(result).to.be.an('array').lengthOf(2);
            });

            it("Each salesman has their own calculation with ID", async function() {
                const result = await response;

                expect(result).to.be.an('array').that.includes.something.that.have.property('salesManID', salesmanExample1._id);
                expect(result).to.be.an('array').that.includes.something.that.have.property('salesManID', salesmanExample3._id);
            });

            it("Each salesman get the correct total", async function() {
                const result = await response;

                expect(result[0].totalBonus).to.be.approximately(701.85, 0.01);
                expect(result[1].totalBonus).to.be.approximately(701.85, 0.01);
            });

        });

        describe('Calculate Bonus for a single Salesman', function() {
            let response;

            beforeEach(async () => {
                await salesmanService.addWithUID(db, copyObject(salesmanExample1));
                await evaluationRecordService.add(db, new EvaluationRecord("Should give 20 Bonus", 5, 4, salesOrderExample1.createdAt, salesmanExample1._id));
                await evaluationRecordService.add(db, new EvaluationRecord("Should give 50 Bonus", 5, 5, salesOrderExample1.createdAt, salesmanExample1._id));
                await evaluationRecordService.add(db, new EvaluationRecord("Should give 100 Bonus", 5, 6, salesOrderExample1.createdAt, salesmanExample1._id));

                response = bonusService.calculateBonusBySalesmanID(db, salesmanExample1._id, salesOrderExample1.createdAt);
            });

            it("All openCRX methods were called correct amount of times", async function() {
                await response;

                expect(getAccountStub).to.have.been.calledOnceWith(salesOrderExample1.customerUID);
                expect(getPositionsStub).to.have.been.calledOnceWith(salesOrderExample1.salesOrderUID);
                expect(getSalesOrdersStub).to.have.been.calledOnceWith(salesmanExample1.uid);
                expect(getProductStub).to.have.been.calledTwice;
                expect(getProductStub).to.have.been.calledWith(positionExample1.productUID);
                expect(getProductStub).to.have.been.calledWith(positionExample2.productUID);

                sinon.assert.callOrder(getSalesOrdersStub, getAccountStub,getPositionsStub, getProductStub);
            });

            it('Returns the expected Sales Order Bonus', async function() {
                const result = (await response).orderBonus;

                expect(result.total).to.approximately(701.85, 0.01);
                expect(result.salesOrders).to.be.an('array').with.lengthOf(1)
            });

            it('Returns the expected Performance Record Bonus', async function() {
                const result = (await response).perfBonus;

                expect(result.total).to.equal(170);
                expect(result.evalRecords).to.be.an('array').with.lengthOf(3);
            });

            it('Returns the correct total bonus', async function() {
                const result = await response;

                expect(result.totalBonus).to.be.approximately(871.85, 0.01);
            });

            it("Maps Client Ranking correctly", async function() {
                let result = (await response).orderBonus;
                expect(result.salesOrders[0].rating).to.equal('excellent');

                getAccountStub.resolves(accountExample2);
                response = bonusService.calculateBonusBySalesmanID(db, salesmanExample1._id, salesOrderExample1.createdAt);
                result = (await response).orderBonus;
                expect(result.salesOrders[0].rating).to.equal('very good');

                getAccountStub.resolves(accountExample3);
                response = bonusService.calculateBonusBySalesmanID(db, salesmanExample1._id, salesOrderExample1.createdAt);
                result = (await response).orderBonus;
                expect(result.salesOrders[0].rating).to.equal('good');
            });
        });
    });
    
    describe("Bonus Computation Service Tests", function() {
        let calculation1, calculation2;

        beforeEach(() => {
            calculation1 = {
                "_id": "63e99ee8fcdf9d934a4820b7",
                "year": 2023,
                "salesManID": 1,
                "totalBonus": 0,
                "orderBonus": {
                  "total": 0,
                  "salesOrders": []
                },
                "perfBonus": {
                  "total": 0,
                  "evalRecords": []
                }
              };
            
            calculation2 = {
                "_id": "63e99ee8fcdf9d934a4820b9",
                "year": 2022,
                "salesManID": 1,
                "totalBonus": 0,
                "orderBonus": {
                  "total": 0,
                  "salesOrders": []
                },
                "perfBonus": {
                  "total": 50,
                  "evalRecords": []
                }
              }
        })
        
        it('Able to add bonus', async function() {
            await expect(bonus_comp_service.getBonusComputationBySalesmanID(db, 1)).to.eventually.exist;
        });

        it('If bonus already exists it is overwritten', async function() {
            await bonus_comp_service.addBonusComputation(db, calculation1);
            await expect(bonus_comp_service.getBonusComputationBySalesmanID(db, 1)).to.eventually.exist;
            await bonus_comp_service.addBonusComputation(db, calculation1);
            await expect(bonus_comp_service.getBonusComputationBySalesmanID(db, 1)).to.eventually.exist;
        });

        it('Able to delete Bonus', async function() {
            await bonus_comp_service.addBonusComputation(db, calculation1);
            await bonus_comp_service.deleteBonusComputation(db, calculation1._id);
            await expect(bonus_comp_service.getBonusComputationBySalesmanID(db, 1)).to.eventually.not.exist;
        });

        it('Able to get by id and year', async function() {
            await bonus_comp_service.addBonusComputation(db, calculation1);
            await bonus_comp_service.addBonusComputation(db, calculation2);

            await expect(bonus_comp_service.getBonusComputationBySalesmanIDAndYear(db, 1, 2022)).to.eventually.eql(calculation2);
        });
    });
});