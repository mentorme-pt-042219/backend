const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if (err) {
                res
                    .status(401)
                    .json({ message: "Error: this request requires user authentication" });
            } else {
                req.decodedJwt = decodedToken;
                next();
            }
        });
    } else {
        res
        .status(401)
        .json({ message: "Error: this request requires user authentication" });
    }
};