const userService = require('../services/user-service')

exports.login = function (req, res){
    const db = req.app.get('db');
    userService.authenticate(db, req.body).then(_=> {
        res.send('login successful');
    }).catch(_=>{
        res.status(401).send('login failed');
    })
}