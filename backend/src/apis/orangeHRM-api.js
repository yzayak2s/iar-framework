const orangeHRMService = require('../services/orangeHRM-service');
const https = require('https');
const qs = require("querystring");
const axios = require("axios");
const httpsAgent = new https.Agent({rejectUnauthorized: false});

// OrangeHRM HTTP Request Header definition
const baseUrl = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php';

const body = qs.stringify({
    client_id: 'api_oauth_id',
    client_secret: 'oauth_secret',
    grant_type: 'password',
    username: 'zayakh',
    password: '*Safb02da42Demo$'
});

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    httpsAgent: httpsAgent,
};

const generateToken = async () => {
    const response = await axios.post(
        `${baseUrl}/oauth/issueToken`,
        body,
        config
    );

    const accessToken = response.data['access_token'];
    return {
        accessToken: accessToken,
        expires_at: new Date().getTime() + 3600 * 60
    }
}

exports.getEmployees = (req, res) => {
    orangeHRMService.getAllEmployees(baseUrl, config, generateToken)
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getEmployeeById = (req, res) => {
    orangeHRMService.getEmployeeByID(baseUrl, config, req.params.id, generateToken)
        .then((employeeById) => {
            res.send(employeeById);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getBonusSalariesByEmployee = (req, res) => {
    orangeHRMService.getBonusSalariesByEmployee(baseUrl, config, req.params.id, generateToken)
        .then((bonusSalaries) => {
            res.send(bonusSalaries);
        }).catch(_ => {
            res.status(500).send();
    });
}