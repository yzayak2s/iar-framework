const userService = require('../services/user-service');

exports.getSelf = async function(req, res){
    const db = req.db;

    res.send(req.session.user);
}