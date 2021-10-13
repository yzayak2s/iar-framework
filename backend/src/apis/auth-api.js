const userService = require('../services/user-service')
const authService = require('../services/auth-service');
const e = require("express");

exports.login = function (req, res){
    const db = req.app.get('db');
    userService.verify(db, req.body).then(user=> {
        authService.authenticate(req.session, user);
        res.send('login successful');
    }).catch(_=>{
        res.status(401).send('login failed');
    })
}

exports.logout = function (req, res){
    authService.deAuthenticate(req.session)
    res.send('logout successful');
}

exports.isLoggedIn = function (req, res){
    if(authService.isAuthenticated(req.session)){
        res.send({loggedIn: true});
    }else {
        res.send({loggedIn: false});
    }
}