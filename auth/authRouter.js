const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");

const tokenService = require("./tokenService.js");
const users = require("../database/helpers/usersDb.js");


// REGISTER A NEW USER
router.post("/register", async (req, res) => {
        let user = req.body;
        if (!user.password || !user.username ) {
            res
                .json({ message: "Username and/or password cannot be blank"})
        } 
        else if 
            (!user.industry) {
                res
                    .json({ message: "Industry cannot be blank "})
            } 
        else if 
            (!user.phoneNumber) {
                res
                    .json({ message: "Phone number cannot be blank "})
                } 
        else {
            const hash = bcrypt.hashSync(user.password, 10);
            user.password = hash;
            try {
                const saved = await db('users').insert(user);
                    // return res.json({ saved })
                if (saved) {
                    const token = tokenService.generateToken(saved);
                    res
                        .status(201)
                        .json({ 
                            message: `Successfully registerd ${user.username}`,
                            token
                        }); 
                }
                else {
                    res 
                        .status(500)
                        .json({ 
                            message: "Failed to save user"
                        });
                }
            }
            catch ({ message }) {
                res
                    .status(500)
                    .json({ message });
            }
        }
});

// LOG IN FOR EXISTING USER
router.post("/login", (req, res) => {
    let { username, password } = req.body;

    users
        .getBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = tokenService.generateToken(user);
                res
                    .status(200)
                    .json({
                        message: `Welcome back, ${user.username}!`,
                        token,
                    });
            } else {
                res
                    .status(401)
                    .json({ message: "Invalid credentials" });
            }
        })
        .catch(error => {
            res
                .status(500)
                .json({ message: "Account cannot be logged into at this time" });
        });
});

module.exports = router;