const axios = require('axios');

var issueToken = {}

async function checkToken(issueToken, generateToken) {
    return issueToken && (issueToken.expires_at - new Date().getTime() > 0) ? issueToken : await generateToken()
}

/**
 * retrieves employees from orangeHRM
 */
exports.getAllEmployees = async (baseUrl, body, config, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const employees = await axios.get(`${baseUrl}/api/v1/employee/search`, config);

    return employees.data.data;
}

/**
 * retrieves an employee by code from orangeHRM
 */
exports.getEmployeeByCode = async (baseUrl, body, config, code, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const employeeByCode = await axios.get(`${baseUrl}/api/v1/employee/${code}`, config);

    return employeeByCode.data.data;
}

/**
 * retrieves bonusSalary of an employee
 */
exports.getBonusSalariesByEmployee = async (baseUrl, body, config, code, generateToken) => {
    const currentToken = await checkToken(issueToken, generateToken);
    const {accessToken, expires_at} = currentToken;

    issueToken.accessToken = accessToken;
    issueToken.expires_at = expires_at;

    config.headers['Authorization'] = `Bearer ${accessToken}`;

    const bonusSalariesByEmployee = await axios.get(`${baseUrl}/api/v1/employee/${code}/bonussalary`, config);
    return bonusSalariesByEmployee.data.data;
}