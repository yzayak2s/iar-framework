const salesmenService = require("../services/salesman-service");

exports.getSalesmen = (req, res) => {
    const db = req.app.get('db');

    salesmenService.getAll(db).then(salesmen => {
        res.send(salesmen);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.addSalesman = (req, res) => {
    const db = req.app.get('db');
    // console.log(req.body)
    salesmenService.add(db, req.body)
        .then(_id => {
            res.send(_id);
        }).catch(() => {
        res.send('ID is already taken. Please try again with another one!')
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.deleteSalesMan = (req, res) => {
    const db = req.app.get('db');
    // console.log(req.params._id)

    salesmenService.delete(db, req.params._id)
        .then(_id => {
            res.send(_id);
        }).catch(() => {
            res.send('ID not found!');
    }).catch(_ => {
        res.status(500).send();
    })
}