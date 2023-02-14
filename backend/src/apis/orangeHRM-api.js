const orangeHRMService = require('../services/orangeHRM-service');

exports.getEmployees = (req, res) => {
    orangeHRMService.getAllEmployees()
        .then((employees) => {
            res.send(employees);
        }).catch(_ => {
            res.send(_);
            // res.status(500).send();
    });
}

exports.getEmployeeById = (req, res) => {
    orangeHRMService.getEmployeeByID(req.params.id)
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

exports.getEmployeePhotoById = (req, res) => {
    orangeHRMService.getEmployeePhotoById(req.params.id)
        .then((photo) => {
            res.send(photo);
        }).catch(_ => {
            res.status(500).send();
    });
}

exports.addBonusSalary = (req, res) => {
    orangeHRMService.add(req.body)
        .then(_ => {
            res.send({message: 'Successfully saved'});
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}
