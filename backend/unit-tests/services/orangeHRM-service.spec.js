const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const rewire = require('rewire')

const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

const orangeHRMService = rewire('../../src/services/orangeHRM-service');

function createMultipleMockResponse() {
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

function createSingleMockResponse() {
	const mockData = {
		"status": "success",
		"data": {
			"data": [
				{"firstName": "Chantal","middleName": "","lastName": "Banks","code": "90133","employeeId": "5","fullName": "Chantal Banks","status": null,"dob": null,"driversLicenseNumber": "","licenseExpiryDate": null,"maritalStatus": "","gender": null,"otherId": "","nationality": null,"unit": "HR","jobTitle": "HR Senior Consultant","supervisor": [{"name": "Michael Moore","id": "7"}]},
			]
		}
	}

	return mockData;
}

tokenGenStub = sinon.stub().resolves({accessToken: '1f64416ad4f287b9d340ed4bc581db490363ae93', expires_at: new Date().getTime() + 3600 * 60});
orangeHRMService.__set__('generateToken', tokenGenStub);

describe('orangeHRM-Service unit-tests', function() {
    beforeEach(() => {
    });

    afterEach(() => {
		// Delete old stub methods
        sinon.restore();

		//We should only generate a token ONCE per test
		expect(tokenGenStub).to.be.calledOnce
    });

    describe("Tests for get methods", function() {
        it.only('All employees were returned', async function() {
			// Mock the get Request
            const axiosGetStub = sinon.stub(axios, "get").resolves(createMultipleMockResponse());
			const response = orangeHRMService.getAllEmployees();

			await expect(response).to.eventually.be.fulfilled;
			await expect(response).to.eventually.have.lengthOf(3);

			expect(axiosGetStub).to.have.been.calledOnceWith('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search');
        });

        it('Employee the id belongs to was returned', async function(){
           
            orangeHRMService.getBonusSalariesByEmployee()
        });

        it('Got all bonus salaries of an employee', async function(){
            
            orangeHRMService.getEmployeeByCode()
        });
    })
})