module.exports = user => {
    return function(req, res, next) {
        if (req.decodedJwt.users && req.decodedJwt.users.includes(user)) {
            next();
        } else {
            res
                .status(403)
                .json({ message: "You are not authorized to access this feature" });
        }
    };
};