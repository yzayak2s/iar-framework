const userService = require('../services/user-service')

exports.login = function (req, res){
    const db = req.app.get('db');
    userService.find(db, req.body).then(_=> {

    }).catch(_=>{

    })
}