const jwt = require("jsonwebtoken");

const secrets = require("../config/secrets.js");

module.exports = {
    generateToken,
};

// CREATE JSON WEB TOKEN
function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: "15m",
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}