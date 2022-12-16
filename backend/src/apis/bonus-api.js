const bonusService = require("../services/bonus-service");

exports.getBonuses = (req, res) => {
    const db = req.app.get('db');

    bonusService.getAll(db).then((bonuses) => {
        res.send(bonuses);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.getBonusById = (req, res) => {
    const db = req.app.get('db');

    bonusService.getBonusById(db, req.params._id)
        .then((bonusById) => {
            res.send(bonusById);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.getBonusesOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    bonusService.getBonusBySalesmanID(db, req.params.salesManID)
        .then((bonusesBySalesManID) => {
            res.send(bonusesBySalesManID);
        }).catch(_ => {
        res.status(500).send();
    });
}

exports.addBonus = (req, res) => {
    const db = req.app.get('db');

    bonusService.add(db, req.body)
        .then((_id) => {
            res.send(_id.toString());
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.updateBonusById = (req, res) => {
    const db = req.app.get('db');

    bonusService.update(db, req.params._id, req.body)
        .then((bonus) => {
            res.send(bonus);
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send()
    });
}

exports.deleteBonus = (req, res) => {
    const db = req.app.get('db');

    bonusService.delete(db, req.params._id)
        .then(_id => {
            res.send(_id.toString());
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.deleteAllBonusesOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    bonusService.deleteBySalesManID(db, req.params.salesManID)
        .then((salesManID) => {
            res.send(salesManID);
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}