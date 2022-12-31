const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const openCRXService = require('../../src/services/openCRX-service');

function createResponse(data) {
    return {
        status: 200,
        statusText: '',
        data: data
    }
}

function createLegalEntity() {
    return createResponse({
        '@type': 'org.opencrx.kernel.account1.LegalEntity',
        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL',
        disabled: false,
        fullName: 'Telekom AG',
        name: 'Telekom AG',
        accountRating: 1,
        accessLevelBrowse: 3,
        accountState: 1,
    })
}

function createContact() {
    return createResponse({
            '@type': 'org.opencrx.kernel.account1.Contact',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL',
            middleName: 'Steven',
            lastName: 'Smith',
            jobTitle: 'Senior Salesman',
            disabled: false,
            fullName: 'Smith, John Steven',
            firstName: 'John',
            governmentId: 90123,
            accountRating: 0,
            accountState: 1
        })
}

function createMixedAccounts(){
    return createResponse({
        '@type': 'org.openmdx.kernel.ResultSet',
        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account',
        '@hasMore': 'false',
        '@total': '2',
        objects: [
            createContact().data,
            createLegalEntity().data
        ]
    })
}

function createProducts(single) {
    if (single) {
        return createResponse({
            '@type': 'org.opencrx.kernel.product1.Product',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/9JMBMVTX2CSMHH2MA4T2TYJFL',
            disabled: false,
            productNumber: 1002,
            name: 'HooverClean',
            description: 'Hoover for service agents',          
        });
    } else {
        return createResponse({
            '@type': 'org.openmdx.kernel.ResultSet',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product',
            '@hasMore': 'false',
            '@total': '2',
            objects: [
                {
                  '@type': 'org.opencrx.kernel.product1.Product',
                  '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/9JMBMVTX2CSMHH2MA4T2TYJFL',
                  disabled: false,
                  productNumber: 1002,
                  name: 'HooverClean',
                  description: 'Hoover for service agents',
                },
                {
                  '@type': 'org.opencrx.kernel.product1.Product',
                  '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/L6K68IE1QROBTH2MA4T2TYJFL',
                  disabled: false,
                  productNumber: 1001,
                  name: 'HooverGo',
                  description: 'Hoover for big companies',
                }
              ]
        })
    }
}

function createSaleOrders(single) {
    if (single) {
        return createResponse({       
            '@type': 'org.opencrx.kernel.contract1.SalesOrder',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J',
            disabled: false,
            totalTaxAmount: '467.500000000',
            customer: {
                '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL',
                '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL'
            },
            totalBaseAmount: '5500.000000000',
            salesRep: {
                '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J',
                '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J'
            },
            priority: 3,
            totalAmountIncludingTax: '5967.500000000',
            contractNumber: 'Telekom_Sallinger_2019',
            name: 'Telekom_Sallinger_2019',
            totalAmount: '5500.000000000',
            createdAt: '2020-01-07T10:45:34.872Z'
        });
    } else {
        return createResponse({
            '@type': 'org.openmdx.kernel.ResultSet',
            '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder',
            '@hasMore': 'false',
            '@total': '3',
            objects: [
                {   
                    '@type': 'org.opencrx.kernel.contract1.SalesOrder',
                    '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J',
                    disabled: false,
                    totalTaxAmount: '467.500000000',
                    customer: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/97NB4O91UQORTH2MA4T2TYJFL'
                    },
                    totalBaseAmount: '5500.000000000',
                    salesRep: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9ENFSDRCBESBTH2MA4T2TYJFL'
                    },
                    priority: 3,
                    totalAmountIncludingTax: '5967.500000000',
                    contractNumber: 'Telekom_Sallinger_2019',
                    name: 'Telekom_Sallinger_2019',
                    totalAmount: '5500.000000000',
                    createdAt: '2020-01-07T10:45:34.872Z'
                },
                {
                    '@type': 'org.opencrx.kernel.contract1.SalesOrder',
                    '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/L4M2BSFAM5GQ3VHF1K43FCO5O',
                    disabled: false,
                    totalTaxAmount: '0.000000000',
                    customer: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9K9OSN1V4YY95H2MA4T2TYJFL',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9K9OSN1V4YY95H2MA4T2TYJFL'
                    },
                    totalBaseAmount: '0.000000000',
                    salesRep: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J'
                    },
                    priority: 3,
                    totalAmountIncludingTax: '0.000000000',
                    contractNumber: 'Mayer Werft AG-S1613220407',
                    name: 'Testing',
                    totalAmount: '0.000000000',
                    createdAt: '2020-01-07T10:45:34.872Z'
                },
                {
                    '@type': 'org.opencrx.kernel.contract1.SalesOrder',
                    '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/L6K69EO6Y3ZS9H2MA4T2TYJFL',
                    disabled: false,
                    totalTaxAmount: '187.000000000',
                    customer: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9K9OSN1V4YY95H2MA4T2TYJFL',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/9K9OSN1V4YY95H2MA4T2TYJFL'
                    },
                    totalBaseAmount: '2200.000000000',
                    salesRep: {
                        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J',
                        '$': 'xri://@openmdx*org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/L0NTAXG7TQTPM0EBHQA5MAZ7J'
                    },
                    priority: 3,
                    totalAmountIncludingTax: '2387.000000000',
                    contractNumber: 'Mayer1',
                    name: 'Mayer1',
                    totalAmount: '2200.000000000',
                    createdAt: '2020-01-07T10:45:34.872Z'
                }
              ]
        })
    }
}

function createSaleOrdersPosition() {
    return createResponse({
        '@type': 'org.openmdx.kernel.ResultSet',
        '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J/position',
        '@hasMore': 'false',
        '@total': '2',
        objects: [
            {
                '@type': 'org.opencrx.kernel.contract1.SalesOrderPosition',
                pricePerUnit: '250.000000000',
                disabled: false,
                identity: 'xri://@openmdx*org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J/position/3CZN0GINLXPT60EBHQA5MAZ7J',
                product: {
                    '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/9JMBMVTX2CSMHH2MA4T2TYJFL',
                    '$': 'xri://@openmdx*org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/9JMBMVTX2CSMHH2MA4T2TYJFL'
                },
                quantity: '10.000000000',
                amount: '2712.500000000000000000000000000'
            },
            {
                '@type': 'org.opencrx.kernel.contract1.SalesOrderPosition',
                pricePerUnit: '200.000000000',
                disabled: false,
                identity: 'xri://@openmdx*org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J/position/3N1IOFZVIDZAI0EBHQA5MAZ7J',
                amount: '3255.000000000000000000000000000',
                product: {
                    '@href': 'https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/L6K68IE1QROBTH2MA4T2TYJFL',
                    '$': 'xri://@openmdx*org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/L6K68IE1QROBTH2MA4T2TYJFL'
                },
                quantity: '15.000000000'
            }
            ]
    })   
}


describe("openCRX-Service unit-tests", function() {
    describe("Mocked API tests", function() {
        afterEach(() => {
            sinon.restore();
        });

        describe("Get Accounts", function() {
            describe("Get all", function() {
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
    
            describe("Get by UID", function() {
                afterEach(() => {
                    sinon.restore();
                });
    
                describe("Get a Legal Entity", function() {
                    let response;
                    let axiosGetStub;
        
                    before(() => {
                        axiosGetStub = sinon.stub(axios, 'get').resolves(createLegalEntity());
                        response = openCRXService.getAccountByUID("test");
                    });
    
                    it("Called correct URL once", function() {
                        expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/test')
                    });
                    
                    it("Got one legal entity", async function() {
                        await expect(response).to.eventually.exist;
                        await expect(response).to.eventually.be.an('object');
                        await expect(response).to.eventually.have.property('accountType', 'LegalEntity');
                    });
    
                    it("values are as expected", async function() {
                        const res = await response;
    
                        expect(res).to.include({'accountType': 'LegalEntity', 'accountUID':'97NB4O91UQORTH2MA4T2TYJFL', 'fullName': 'Telekom AG', 'accountRating': 1, 'accountState': 1});
                    });
                });
    
                describe("Get a Contact", function() {
                    let response;
                    let axiosGetStub;
        
                    before(() => {
                        axiosGetStub = sinon.stub(axios, 'get').resolves(createContact());
                        response = openCRXService.getAccountByUID("test");
                    });
    
                    it("Called correct URL once", function() {
                        expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/test')
                    });
    
                    it("Got one contact", async function() {
                        await expect(response).to.eventually.exist;
                        await expect(response).to.eventually.be.an('object');
                        await expect(response).to.eventually.have.property('accountType', 'Contact');
                    });
    
                    it("values are as expected", async function() {
                        const res = await response;
    
                        expect(res).to.include({'accountType': 'Contact', 'accountUID':'9ENFSDRCBESBTH2MA4T2TYJFL', 'fullName': 'Smith, John Steven', 'accountRating': 0, 'accountState': 1});
                    });
                });
            });
        });
       
        describe("Get Products", function() {
            describe("Get all", function() {
                let response;
                let axiosGetStub;
    
                before(() => {
                    axiosGetStub = sinon.stub(axios, 'get').resolves(createProducts(false));
                    response = openCRXService.getAllProducts();
                });

                it("Calls the correct URL once", function() {
                    expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product');
                });

                it("Returns array", async function() {
                    await expect(response).to.eventually.be.an('array').with.lengthOf(2);
                });

                it("Is a product", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.property('productType', 'Product');
                });

                it("Has the correct keys", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.keys('productType','productUID', 'productNumber', 'name', 'description');
                });
            });

            describe("get by UID", function() {
                let response;
                let axiosGetStub;
    
                before(() => {
                    axiosGetStub = sinon.stub(axios, 'get').resolves(createProducts(true));
                    response = openCRXService.getProductByUID('9JMBMVTX2CSMHH2MA4T2TYJFL');
                });

                it("Calls the correct URL once", function() {
                    expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/9JMBMVTX2CSMHH2MA4T2TYJFL');
                });

                it("Returns object", async function() {
                    await expect(response).to.eventually.be.an('object').and.to.exist;
                });

                it("Is a product", async function() {
                    await expect(response).to.eventually.have.property('productType', 'Product');
                });

                it("Has the correct keys", async function() {
                    const res = await response;
                    expect(res).to.have.keys('productType','productUID', 'productNumber', 'name', 'description');
                });
            });
        });
        
        describe("Get salesorder", function() {
            describe("Get all", function() {
                let response;
                let axiosGetStub;
    
                before(() => {
                    axiosGetStub = sinon.stub(axios, 'get').resolves(createSaleOrders(false));
                    response = openCRXService.getAllSalesOrders();
                });

                it("Calls the correct URL once", function() {
                    expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder');
                });

                it("Returns array", async function() {
                    await expect(response).to.eventually.be.an('array').with.lengthOf(3);
                });

                it("Is a SalesOrder", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.property('contractType', 'SalesOrder');
                });

                it("Has the correct keys", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.keys("contractType", "salesOrderUID","customerUID", "priority", "salesRep", "contractNumber", "totalTaxAmount", "totalBaseAmount", "totalAmountIncludingTax", "createdAt");
                });
            });

            describe("get by UID", function() {
                let response;
                let axiosGetStub;
    
                before(() => {
                    axiosGetStub = sinon.stub(axios, 'get').resolves(createSaleOrders(true));
                    response = openCRXService.getSalesOrderByUID('9DTSXR06DLHPM0EBHQA5MAZ7J');
                });

                it("Calls the correct URL once", function() {
                    expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J');
                });

                it("Returns object", async function() {
                    await expect(response).to.eventually.be.an('object').and.to.exist;
                });

                it("Is a SalesOrder", async function() {
                    await expect(response).to.eventually.have.property('contractType', 'SalesOrder');
                });

                it("Has the correct keys", async function() {
                    const res = await response;
                    expect(res).to.have.keys("contractType", "salesOrderUID","customerUID", "priority", "salesRep", "contractNumber", "totalTaxAmount", "totalBaseAmount", "totalAmountIncludingTax", "createdAt");
                });
            });

            describe("get by SalesRep UID", function() {
                let response;
                let axiosGetStub;
    
                before(() => {
                    axiosGetStub = sinon.stub(axios, 'get').resolves(createSaleOrders(false));
                    response = openCRXService.getSalesOrdersBySalesRepUID('L0NTAXG7TQTPM0EBHQA5MAZ7J');
                });

                it("Calls the correct URL once", function() {
                    expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder');
                });

                it("Returns array", async function() {
                    await expect(response).to.eventually.be.an('array').with.lengthOf(2);
                });

                it("Is a SalesOrder", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.property('contractType', 'SalesOrder');
                });

                it("All Orders belong to our salesman", async function() {
                    const res = await response;

                    expect(res).to.be.an('array').that.includes.something.that.all.have.property('salesRep', 'L0NTAXG7TQTPM0EBHQA5MAZ7J');
                });

                it("Has the correct keys", async function() {
                    const res = await response;
                    expect(res).to.be.an('array').that.includes.something.that.all.have.keys("contractType", "salesOrderUID","customerUID", "priority", "salesRep", "contractNumber", "totalTaxAmount", "totalBaseAmount", "totalAmountIncludingTax", "createdAt");
                });
            });
        });

        describe("Get positions by UID", function() {
            let response;
            let axiosGetStub;

            before(() => {
                axiosGetStub = sinon.stub(axios, 'get').resolves(createSaleOrdersPosition());
                response = openCRXService.getAllPositionsByUID('9DTSXR06DLHPM0EBHQA5MAZ7J');
            });

            it("Calls the correct URL once", function() {
                expect(axiosGetStub).to.be.calledOnceWith('https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/9DTSXR06DLHPM0EBHQA5MAZ7J/position');
            });

            it("Returns array", async function() {
                await expect(response).to.eventually.be.an('array').with.lengthOf(2);
            });

            it("Is a position", async function() {
                const res = await response;
                expect(res).to.be.an('array').that.includes.something.that.all.have.property('contractType', 'SalesOrderPosition');
            });

            it("Has the correct keys", async function() {
                const res = await response;
                expect(res).to.be.an('array').that.includes.something.that.all.have.keys("contractType", "positionUID", "productUID", "quantity", "pricePerUnit", "amount");
            });
        });
    });
});