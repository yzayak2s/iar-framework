const bonusComputationService = require("../services/bonus-computation-service");

exports.getBonusComputationBySalesManIDAndYear = (req, res) => {
    const db = req.app.get('db');

    bonusComputationService.getBonusComputationBySalesmanIDAndYear(db, parseInt(req.params.salesManID), parseInt(req.params.year))
        .then((bonusComputation) => {
            res.send(bonusComputation);
        }).catch((e) => {
        res.status(500).send(e.message);
    }).catch(_ => {
        res.status(500).send();
    });
}