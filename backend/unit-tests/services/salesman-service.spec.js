const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require('../support/mongodb-mocking');

const salesmanService = require('../../src/services/salesman-service');
const openCRXService = require('../../src/services/openCRX-service');
const orangeHRMService = require('../../src/services/orangeHRM-service');
const SalesMan = require('../../src/models/SalesMan');
const {copyObject} = require('../support/copyObject');

const salesMan = new SalesMan('Wilhelm', '', 'Schwarz', 'Wilhelm Schwarz', 'Sales', 'Senior Salesman', 1)
const salesMan2 = new SalesMan('Jane', '', 'Samuel', 'Jane Samuel', 'Sales', 'Senior Salesman', 2)
const salesMan3 = new SalesMan('Karl', '', 'Lauterbach', 'Karl Lauterbach', 'Sales', 'Senior Salesman', 1)

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
        describe('add normal salesman', function() {
            it('insert salesman to db', async function(){
                await salesmanService.add(db, copyObject(salesMan))
                await expect(db.collection('salesmen').findOne()).to.eventually.excluding('_id').be.eqls(salesMan)
            });

            it('expect correct objectId to be returned', async function() {
                const sid = await salesmanService.add(db, copyObject(salesMan));
                await expect(db.collection('salesmen').findOne()).to.eventually.have.property('_id', sid);
            });

            it('throws if salesman id is already used', async function() {
                const sid = await salesmanService.add(db, copyObject(salesMan));

                await expect(salesmanService.add(db, copyObject(salesMan))).to.be.rejectedWith('Salesman with id 1 already exist!')
            });

            it('throws if given object is incorrect', async function() {
                // id should be _id
                await expect(salesmanService.add(db, {firstname: 'bob', lastname: 'heh', id: 5})).to.be.rejectedWith('Incorrect body object was provided. Needs _id, firstname and lastname.')
            });
        });

        describe('add salesman with UID', function() {
            let salesmanUID;

            before(() => {
                salesmanUID = copyObject(salesMan);
                salesmanUID.uid = "EOMGEO7NTI$§J&I$WMAOMFSOIANTIENT"
            })

            it('insert salesman with UID to db', async function(){
                await salesmanService.addWithUID(db, salesmanUID)
                await expect(db.collection('salesmen').findOne()).to.eventually.excluding('_id').be.eqls(salesmanUID)
            });

            it('expect correct objectId to be returned', async function() {
                const sid = await salesmanService.addWithUID(db, copyObject(salesmanUID));
                await expect(db.collection('salesmen').findOne()).to.eventually.have.property('_id', sid);
            });

            it('throws if salesman id is already used', async function() {
                await salesmanService.addWithUID(db, copyObject(salesmanUID));

                await expect(salesmanService.addWithUID(db, copyObject(salesmanUID))).to.be.rejectedWith('Salesman with id 1 already exist!')
            });

            it('throws if given object is incorrect', async function() {
                // missing uid
                await expect(salesmanService.addWithUID(db, {firstname: 'bob', lastname: 'heh', _id: 5})).to.be.rejectedWith('Incorrect body object was provided. Needs _id, firstname, lastname and uid.')
            });
        })
    });

    describe('salesman lookup tests', function(){
        it('expect correct salesman with firstname to be found', async function(){
            await db.collection('salesmen').insert([salesMan, salesMan2]);
            await expect(salesmanService.getSalesManByFirstname(db, salesMan.firstname)).to.eventually.be.eqls(salesMan);
        });

        it('expect null when salesman not found', async function() {
            await expect(salesmanService.getSalesManByFirstname(db, 'firstname')).to.eventually.be.null;
        });

        it('expect list of salesman', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await salesmanService.add(db, copyObject(salesMan2));

            await expect(salesmanService.getAll(db)).to.eventually.be.eqls([salesMan, salesMan2]);
        });

        it('expect correct salesman with id to be found', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await salesmanService.add(db, copyObject(salesMan2));

            await expect(salesmanService.getSalesManById(db, 1)).to.eventually.be.eql(salesMan);
        });
    });

    describe('salesman update tests', function(){
        it('update salesman in db', async function() {
            await salesmanService.add(db, copyObject(salesMan));
            await salesmanService.update(db, salesMan._id, copyObject(salesMan3));
            await expect(db.collection('salesmen').findOne()).to.eventually.be.eqls(salesMan3);
        });

        it('updating not existing salesman throws', async function() {
            await expect(salesmanService.update(db, 1, copyObject(salesMan))).to.be.rejectedWith("Salesmen with id 1 doesn't exist!");
        });
    });

    describe('salesman delete tests', function() {
        it('salesman is deleted', async function() {
            await salesmanService.add(db, copyObject(salesMan));

            await expect(salesmanService.delete(db, salesMan._id)).to.eventually.be.fulfilled;
            await expect(salesmanService.getSalesManById(db, salesMan._id)).to.eventually.be.null;
        });

        it('throws if trying to delete not existing salesman', async function() {
            await expect(salesmanService.delete(db, 1)).to.be.rejectedWith("Salesman with id 1 doesn't exist!");
        });
    });

    describe('stubbed tests for getting API salesman', function() {
        let openCRXstub, orangeHRMstub;

        beforeEach(() => {
            openCRXstub = sinon.stub(openCRXService, 'getAllAccounts').resolves([
                [
                    {  
                        "accountType": "LegalEntity",
                        "accountUID": "63AE23091189613200688C92",
                        "fullName": "Barbie GMBH",
                        "accountRating": 2,
                        "accessLevelBrowse": 3,
                        "accountState": 1
                    }
                ], [        
                    {
                        "accountType": "Contact",
                        "accountUID": "63AE22EDEBF659D75714C1F4",
                        "firstName": "Bob",
                        "lastName": "Marley",
                        "governmentId": 98782
                    },
                    {
                        "accountType": "Contact",
                        "accountUID": "63AE22F2E90BA570217D7C75",
                        "firstName": "John",
                        "lastName": "Smith",
                        "governmentId": 75342
                    }    
                ]
            ]);

            orangeHRMstub = sinon.stub(orangeHRMService, 'getAllEmployees').resolves([
                {
                    "firstName": "Bob",
                    "middleName": "",
                    "lastName": "Marley",
                    "code": "98782",
                    "employeeId": "2",
                    "fullName": "Bob Marley",
                },
                {
                    "firstName": "Kevin",
                    "middleName": "",
                    "lastName": "Klein",
                    "code": "90732",
                    "employeeId": "1",
                    "fullName": "Kevin Klein",
                }
            ]);
        });

        afterEach(() => {
            sinon.restore();
        })

        describe('Stub tests', function() {
            describe('OpenCRXService Stub', function() {
                let response; 

                beforeEach(async () => {
                    response = openCRXService.getAllAccounts();
                })

                it('Got 3 Accounts', async function() {
                    await expect(response).to.eventually.be.fulfilled;
                    await expect(response).to.eventually.be.an('array').lengthOf(2);

                    const res = await response;
                    expect(res[0].length + res[1].length).to.be.eql(3);
                });
    
                it('Got 2 Contacts and 1 Legal Entity', async function() {
                    const res = await response;

                    expect(res[0]).to.be.an('array').with.lengthOf(1);
                    expect(res[0]).to.be.an('array').that.includes.something.that.all.have.property('accountType', 'LegalEntity');
                    expect(res[1]).to.be.an('array').with.lengthOf(2);
                    expect(res[1]).to.be.an('array').that.includes.something.that.all.have.property('accountType', 'Contact');
                });
            });

            describe('OrangeHRMService Stub', function() {
                let response; 

                beforeEach(async () => {
                    response = orangeHRMService.getAllEmployees();
                })
                
                it('Got 2 Employees', async function() {
                    await expect(response).to.eventually.be.fulfilled;
                    await expect(response).to.eventually.be.an('array').lengthOf(2);
                });
            });
        });
        
        describe('getSalesmenFromAPI Tests', function() {
            beforeEach(async () => {
                await salesmanService.add(db, new SalesMan('Kevin', 'big', 'Failure', 'Kevin big Failure', 'Sales', 'Senior Salesman', 2, null));
                await salesmanService.getSalesmenFromAPI(db);
            });

            it('Adds two salesman to DB', async function() {
                await expect(salesmanService.getAll(db)).to.eventually.be.an('array').with.lengthOf(2);
                await expect(salesmanService.getSalesManById(db, 1)).to.eventually.exist;
                await expect(salesmanService.getSalesManById(db, 2)).to.eventually.exist;
            });

            it('Expect one salesman to have UID', async function() {
                expect(await salesmanService.getSalesManById(db, 2)).to.have.property('uid', '63AE22EDEBF659D75714C1F4');
            });

            it('Expect one salesman to not have a UID', async function() {
                expect((await salesmanService.getSalesManById(db, 1)).uid).to.be.undefined;
            });

            it('Expected old salesman with same id to be overwritten', async function() {
                expect(await salesmanService.getSalesManById(db, 2)).to.not.be.eql(new SalesMan('Kevin', 'Failure', 2, null));
            });
        });
    });
})