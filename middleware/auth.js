const jwt = require("jsonwebtoken");
const config = require("../config.json");

module.exports = {
    authentication(req, res, next) {
        const { authorization } = req.headers || req.body;
        jwt.verify(authorization, config.secret, (err, decoded) => {
            if (err) {
                return res.sendStatus(401);
            }
            req.headers.user = decoded;
            return next();
        })
    }
}