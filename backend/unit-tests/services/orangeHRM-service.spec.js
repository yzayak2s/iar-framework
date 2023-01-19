const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const rewire = require('rewire');

const expect = chai.expect;
chai.use(require('chai-things'));
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const orangeHRMService = rewire('../../src/services/orangeHRM-service');

function createMultipleMockUser() {
	const mockData = {
		"status": "success",
		"data": {
			"data": [
				{"firstName": "Sascha","middleName": "","lastName": "Alda","code": "98222","employeeId": "3","fullName": "Sascha Alda","status": null,"dob": null,"driversLicenseNumber": "","licenseExpiryDate": null,"maritalStatus": "","gender": null,"otherId": "","nationality": null,"unit": "IT","jobTitle": "External Consultant","supervisor": null}, 
				{"firstName": "Chantal","middleName": "","lastName": "Banks","code": "90133","employeeId": "5","fullName": "Chantal Banks","status": null,"dob": null,"driversLicenseNumber": "","licenseExpiryDate": null,"maritalStatus": "","gender": null,"otherId": "","nationality": null,"unit": "HR","jobTitle": "HR Senior Consultant","supervisor": [{"name": "Michael Moore","id": "7"}]},
				{"firstName": "John","middleName": "","lastName": "Doe","code": "91338","employeeId": "85","fullName": "John Doe","status": null,"dob": null,"driversLicenseNumber": "","licenseExpiryDate": null,"maritalStatus": null,"gender": null,"otherId": "","nationality": null,"unit": "Sales","jobTitle": null,"supervisor": null}
			]
		}
	}

	return mockData;
}

function createSingleMockUser() {
	const mockData = {
		"status": "success",
		"data": {
			"data": {"firstName": "Chantal","middleName": "","lastName": "Banks","code": "90133","employeeId": "5","fullName": "Chantal Banks","status": null,"dob": null,"driversLicenseNumber": "","licenseExpiryDate": null,"maritalStatus": "","gender": null,"otherId": "","nationality": null,"unit": "HR","jobTitle": "HR Senior Consultant","supervisor": [{"name": "Michael Moore","id": "7"}]},
		}
	}

	return mockData;
}

function createMultipleMockBonus() {
	const mockData = {
		"status": "success",
		"data": {
			"data": [
				{"year":"2021","value":"500"},
				{"year":"2022","value":"20000"}
			]
		}
	}

	return mockData;
}

describe('orangeHRM-Service unit-tests', function() {
	describe("Test for generateToken method", function() {
		let axiosPostStub;
		let response;
	
		before(() => {
			const getTokenFunction = orangeHRMService.__get__('generateToken');
			axiosPostStub = sinon.stub(axios, 'post').resolves({
				status: 200,
				statusText: 'OK',
				data: {
				  access_token: '0ccafac346b9b191c7587192b1f2706e44b1cd7f',
				  expires_in: 3600,
				  token_type: 'bearer',
				  scope: null,
				  refresh_token: 'd1c8f0c2ebdf4630258737b46d8e53a158df4fe4'
				}
			  });
			
			response = getTokenFunction();
		});
		
		it("Gets a response", async function() {
			await expect(response).to.be.fulfilled;
			await expect(response).to.eventually.exist;
		});
	
		it("sent only one request to OrangeHRM", function() {
			expect(axiosPostStub).to.be.calledOnceWith('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/oauth/issueToken');
		});
	
		it("returned a token", async function() {
			await expect(response).to.eventually.have.property('accessToken').that.exist;
		});
	
		it("returned a expiry date", async function() {
			await expect(response).to.eventually.have.property('expires_at').that.exist;
		});
	});

	describe("Tests with Mocked API", function() {
		let tokenGenStub;

		before(() => {
			tokenGenStub = sinon.stub().resolves({accessToken: '1f64416ad4f287b9d340ed4bc581db490363ae93', expires_at: new Date().getTime() + 3600 * 60});
			orangeHRMService.__set__('generateToken', tokenGenStub);
		});
	
		after(() => {
			//We should only generate a token ONCE
			expect(tokenGenStub).to.be.calledOnce;
		})
	
		afterEach(() => {
			sinon.restore()
		})

		describe("Tests for get methods", function() {
			describe("Getting all employees", function() {
				let axiosGetStub;
				let response;

				before(() => {
					// Mock the get Request
					axiosGetStub = sinon.stub(axios, "get").resolves(createMultipleMockUser());
					response = orangeHRMService.getAllEmployees();
				});

				it("returns 3 employees", async function() {
					await expect(response).to.eventually.be.fulfilled;
					await expect(response).to.eventually.be.an('array');
					await expect(response).to.eventually.have.lengthOf(3);
				});

				it("called the correct URL once", function() {
					expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search?unit=2');
				});

				it("Generated a token before calling", function() {
					expect(axiosGetStub).to.have.been.calledAfter(tokenGenStub);
				});

				
				it("Got the correct employees", async function() {
					const res = await response;

					expect(res).to.be.an('array').that.includes.something.that.all.include.keys('firstName', 'lastName', 'code', 'employeeId');
					expect(res[0]).to.include({'firstName':'Sascha', 'lastName':'Alda', 'code':'98222', 'employeeId':'3'});
					expect(res[1]).to.include({'firstName':'Chantal', 'lastName':'Banks', 'code':'90133', 'employeeId':'5'});
					expect(res[2]).to.include({'firstName':'John', 'lastName':'Doe', 'code':'91338', 'employeeId':'85'});
				});
			});

			describe("Getting an employee by id", function () {
				let axiosGetStub;
				let response;
				
				before(() => {
					// Mock the get Request
					axiosGetStub = sinon.stub(axios, "get").resolves(createSingleMockUser());
					response = orangeHRMService.getEmployeeByID(5);
				});

				it("correct employee was returned", async function(){
					await expect(response).to.eventually.include({'firstName':'Chantal', 'lastName':'Banks', 'code':'90133', 'employeeId':'5'});
				});

				it("returns a single employee", async function() {
					await expect(response).to.eventually.be.fulfilled;
					await expect(response).to.eventually.be.an('object');
				});

				it("called the correct URL once", function() {
					expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/5');
				});

				it("Generated a token before calling", function() {
					expect(axiosGetStub).to.have.been.calledAfter(tokenGenStub);
				});
			});

			describe("Getting the bonus salary of an employee", function () {
				let axiosGetStub;
				let response;
				
				before(() => {
					// Mock the get Request
					axiosGetStub = sinon.stub(axios, "get").resolves(createMultipleMockBonus());
					response = orangeHRMService.getBonusSalariesByEmployee(5);
				});

				it("called the correct URL once", function() {
					expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/5/bonussalary');
				});

				it("Generated a token before calling", function() {
					expect(axiosGetStub).to.have.been.calledAfter(tokenGenStub);
				});

				it('Got 2 bonuses', async function(){
					await expect(response).to.eventually.be.fulfilled;
					await expect(response).to.eventually.be.an('array').with.lengthOf(2);
				});

				it("Bonus has correct value", async function() {
					const res = await response;
					expect(res).to.be.an('array').that.includes.something.that.all.include.keys('value', 'year');
					expect(res).to.have.deep.members([{"year":"2021","value":"500"}, {"year":"2022","value":"20000"}]);
				});
			});
		});

		describe("Tests for adding Bonus salary", function() {
			describe("Add a bonus salary to OrangeHRM", function() {
				let axiosPostStub;
				let requestBody;

				before(() => {
					axiosPostStub = sinon.stub(axios, 'post').resolves();
					requestBody = {
						"_id": 1,
						"year": 2040,
						"value": 500,
						"verified": "pending",
						"salesManID": 3
					};
				});	

				it("Successfully posts", async function () {
					await expect(orangeHRMService.add(requestBody)).to.eventually.be.fulfilled;
				});

				it("Called the correct URL once", function() {
					expect(axiosPostStub).to.have.been.calledOnceWith(`https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${requestBody.salesManID}/bonussalary`);
				});

				it("Added the bonus to the request body", function () {
					expect(axiosPostStub).to.have.been.calledWith(`https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${requestBody.salesManID}/bonussalary`, {'year': requestBody.year, 'value': requestBody.value});
				});
			});
		});
	});
});