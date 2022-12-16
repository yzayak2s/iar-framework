const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const openCRXService = require('../../src/services/openCRX-service');

function createLegalEntity() {
    return {
        status: 200,
        statusText: '',
        data: {
          '@type': 'org.opencrx.kernel.account1.LegalEntity',
          '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL',
          disabled: false,
          fullName: 'Telekom AG',
          name: 'Telekom AG',
          accountRating: 1,
          accessLevelBrowse: 3,
          accountState: 1,
        }
    }
}

function createContact() {
    return {
        status: 200,
        statusText: '',
        data: {
            '@type': 'org.opencrx.kernel.account1.Contact',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL',
            middleName: 'Steven',
            lastName: 'Smith',
            jobTitle: 'Senior Salesman',
            disabled: false,
            fullName: 'Smith, John Steven',
            firstName: 'John',
            governmentId: 90123,
        }
    }
}

function createMixedAccounts(){
    return {
        status: 200,
        statusText: '',
        data: {
            '@type': 'org.openmdx.kernel.ResultSet',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account',
            '@hasMore': 'false',
            '@total': '2',
            objects: [
                createContact().data,
                createLegalEntity().data
            ]
        }
    }

}

describe.only("openCRX-Service unit-tests", function() {
    describe("Mocked API tests", function() {
        afterEach(() => {
            sinon.restore();
        });

        describe("Get all Accounts", function() {
            let response;
            let axiosGetStub;

            before(() => {
                axiosGetStub = sinon.stub(axios, 'get').resolves(createMixedAccounts());
                response = openCRXService.getAllAccounts();

            });

            it("Calls the correct URL once", function() {
                expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account');
            });

            it("Returns an array with two arrays inside", async function() {
                expect(await response).to.be.an('array').that.contains.an('array');
            });

            it("First array contains legal entities", async function() {
                const res = await response;
                expect(res[0]).to.be.an('array').that.includes.something.that.all.have.property('accountType', 'LegalEntity');
                expect(res[0]).to.have.lengthOf(1);
            });

            it("Legal entities have all keys", async function() {
                const res = await response;
                expect(res[0]).to.be.an('array').that.includes.something.that.all.have.keys('accountType', 'accountUID', 'fullName', 'accountRating', 'accessLevelBrowse','accountState');
            });

            it("Second array contains contacts", async function() {
                const res = await response;
                expect(res[1]).to.be.an('array').that.includes.something.that.all.have.property('accountType', 'Contact');
                expect(res[1]).to.have.lengthOf(1);
            });

            it("Contacts have all keys", async function() {
                const res = await response;
                expect(res[1]).to.be.an('array').that.includes.something.that.all.have.keys('accountType', 'accountUID', 'firstName', 'lastName', 'governmentId');
            });
        });
        
    });
});