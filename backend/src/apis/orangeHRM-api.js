const orangeHRMService = require('../services/orangeHRM-service');

exports.getEmployees = (req, res) => {
    orangeHRMService.getAllEmployees()
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getEmployeeByCode = (req, res) => {
    orangeHRMService.getEmployeeByCode(req.params.code)
        .then((employeeByCode) => {
            res.send(employeeByCode);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getBonusSalariesByEmployee = (req, res) => {
    orangeHRMService.getBonusSalariesByEmployee(req.params.code)
        .then((bonusSalaries) => {
            res.send(bonusSalaries);
        }).catch(_ => {
            res.status(500).send();
    });
}