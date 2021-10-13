exports.authenticate = function (session, user){
    session.authenticated = true;
    delete user.password;
    session.user = user;
}

exports.isAuthenticated = function (session){
    return session.authenticated;
}

exports.deAuthenticate = function (session){
    session.authenticated = false;
    session.destroy();
}