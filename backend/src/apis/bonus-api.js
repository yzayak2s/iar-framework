const bonusService = require("../services/bonus-service");
const {ObjectId} = require("mongodb");

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

    bonusService.getBonusById(db, ObjectId(req.params._id))
        .then((bonusById) => {
            // Check if this Object belongs to the asking salesman
            if (req.checkID && bonusById.salesManID != req.session.user._id) {
                res.status(401).send("Salesman may only access their own data.");
            }

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

    bonusService.update(db, ObjectId(req.params._id), req.body)
        .then((bonus) => {
            res.send(bonus);
        }).catch((e) => {
        res.send(e.message);
    }).catch(_ => {
        res.status(500).send()
    });
}

exports.updateBonusRemarkById = (req, res) => {
    const db = req.app.get('db');

    bonusService.updateRemark(db, ObjectId(req.params._id), req.body.remark)
        .then((bonus) => {
            res.send(bonus);
        }).catch(() => {
            res.status(500).send({"message": "Something went wrong"});
        })
}

exports.updateBonusStatusById = (req, res) => {
    const db = req.app.get('db');

    bonusService.updateVerified(db, ObjectId(req.params._id), req.body.status)
        .then((bonus) => {
            res.send(bonus);
        }).catch(() => {
            res.status(500).send({"message": "Something went wrong"});
        })
}

exports.deleteBonus = (req, res) => {
    const db = req.app.get('db');

    bonusService.delete(db, ObjectId(req.params._id))
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

exports.calculateBonus = (req, res) => {
    const db = req.app.get('db');

    bonusService.calculateBonusBySalesmanID(db, parseInt(req.params.salesManID), parseInt(req.params.year))
        .then((calculatedBonus) => {
            res.send(calculatedBonus);
        }).catch((e) => {
            res.send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}

exports.calculateAllBonus = (req, res) => {
    const db = req.app.get('db');

    bonusService.calculateAllBonus(db, parseInt(req.params.year))
        .then((calculatedBonuses) => {
            res.send(calculatedBonuses);
        }).catch((e) => {
            res.status(500).send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}