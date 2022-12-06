const axios = require('axios');

/**
 * retrieves employees from orangeHRM
 */
exports.getAllEmployees = async (baseUrl, body, config) => {
    const response = await axios.post(
        `${baseUrl}/oauth/issueToken`,
        body,
        config
    );

    const accessToken = response.data['access_token']; // also with .access_token accessible

    const {httpsAgent} = config
    const configWithToken = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
    }

    const employees = await axios.get(`${baseUrl}/api/v1/employee/search`, configWithToken);

    return employees.data.data;
    /*console.log(accessToken)
    console.log(expiresAt)
    console.log(response.data.access_token)
    console.log(new Date().getTime())
    console.log(new Date().getTime() + 3600 * 60)*/
}

/**
 * retrieves an employee by code from orangeHRM
 */
exports.getEmployeeByCode = async (baseUrl, body, config, code) => {
    const response = await axios.post(
        `${baseUrl}/oauth/issueToken`,
        body,
        config
    );

    const accessToken = response.data['access_token']; // also with .access_token accessible

    const {httpsAgent} = config
    const configWithToken = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
    }

    const employeeByCode = await axios.get(`${baseUrl}/api/v1/employee/${code}`, configWithToken);
    return employeeByCode.data.data;
}

/**
 * retrieves bonusSalary of an employee
 */
exports.getBonusSalariesByEmployee = async (baseUrl, body, config, code) => {
    const response = await axios.post(
        `${baseUrl}/oauth/issueToken`,
        body,
        config
    );

    const accessToken = response.data['access_token']; // also with .access_token accessible

    const {httpsAgent} = config
    const configWithToken = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        httpsAgent: httpsAgent, // this was missing (for what is this)?
    }

    const bonusSalaryByEmployee = await axios.get(`${baseUrl}/api/v1/employee/${code}/bonussalary`, configWithToken);
    //console.log(bonusSalaryByEmployee)
    return bonusSalaryByEmployee.data.data;
}