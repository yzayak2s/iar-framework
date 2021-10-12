exports.authenticate = function (session, user){
    session.authenticated = true;
    session.user = user;
}

exports.isAuthenticated = function (session){
    return session.authenticated;
}

exports.deAuthenticate = function (session){
    session.authenticated = false;
    session.destroy();
}