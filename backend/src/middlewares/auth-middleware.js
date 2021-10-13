exports.checkAuthorization = (beAdmin) => {
    return (req, res, next) => {
        if(req.session.authenticated){
            if(!beAdmin || req.session.user.isAdmin){
                next();
                return;
            }
        }
        res.status(401).send();
    }
}