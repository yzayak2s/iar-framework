const evaluationService = require("../services/evaluation-record-service.js");

exports.getAllEvaluationRecords = (req, res) => {
    const db = req.app.get('db');

    evaluationService.getAll(db).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getEvaluationRecordsById = (req, res) =>  {
    const db = req.app.get('db');

    evaluationService.getById(db, req.params._id).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.getEvaluationRecordsOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.getBySalesmanID(db, req.params.salesManID).then(evaRec => {
        res.send(evaRec);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.addEvaluationRecord = (req, res) => {
    const db = req.app.get('db');
    // console.log(req.body)
   evaluationService.add(db, req.body)
    .then(_id => {
        res.send(_id);
    }).catch((e) => {
        res.status(404).send(e.message);
    }).catch(_ => {
        res.status(500).send();
    })
}

exports.updateEvaluationRecordById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.updateById(db, req.params._id, req.body)
        .then(_id => {
            res.send(_id);
        }).catch((e) => {
            res.status(404).send(e.message);
        }).catch(_ => {
            res.status(500).send();
        })
}

exports.deleteEvaluationRecord = (req, res) => {
    const db = req.app.get('db');
    // console.log(req.params._id)

   evaluationService.delete(db, req.params._id)
        .then(_id => {
            res.send(_id);
        }).catch(() => {
            res.status(404).send('ID not found!');
    }).catch(_ => {
        res.status(500).send();
    })

}

exports.deleteAllEvaluationRecordsOfSalesmanById = (req, res) => {
    const db = req.app.get('db');

    evaluationService.deleteBySalesmanID(db, req.params.salesManID)
        .then(salesManID => {
            res.send(salesManID);
        }).catch((e) => {
            res.status(404).send(e.message);
        }).catch(_ => {
            res.status(500).send();
        })
}