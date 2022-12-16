const orangeHRMService = require('../services/orangeHRM-service');

exports.getEmployees = (req, res) => {
    orangeHRMService.getAllEmployees()
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getEmployeeById = (req, res) => {
    orangeHRMService.getEmployeeById(req.params.id)
        .then((employeeById) => {
            res.send(employeeById);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.getBonusSalariesByEmployee = (req, res) => {
    orangeHRMService.getBonusSalariesByEmployee(req.params.id)
        .then((bonusSalaries) => {
            res.send(bonusSalaries);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.addBonusSalary = (req, res) => {
    orangeHRMService.add(baseUrl, config, req.body, generateToken)
        .then((_id) => {
            res.send(_id.toString());
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}