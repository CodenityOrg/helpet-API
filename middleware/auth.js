const jwt = require("jsonwebtoken");
const config = require("../config.json");
const User = require("../models/User");
module.exports = {
    authentication(req, res, next) {
        const { authorization } = req.headers || req.body;
        jwt.verify(authorization, config.secret, async (err, userId) => {
            if (err) {
                return res.sendStatus(401);
            }
            const user = await User.findById(userId).exec();
            req.headers.user = user;
            return next();
        })
    }
}