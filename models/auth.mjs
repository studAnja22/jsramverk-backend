import database from '../db/database.mjs';
import users from '../models/users.mjs';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

const auth = {
    login: async function login(body) {
        const userInputEmail = body.email;
        const userInputPassword = body.password;

        //Check if user submitted email and password
        if (!userInputEmail || !userInputPassword) {
            return {
                data: {
                    type: "fail",
                    message: "email or password missing",
                    user: {
                        email: userInputEmail
                    }
                }
            }
        }
        //Check if user in db
        const userExists = await users.emailExists(body);
        //Email not found in database - return.
        if (!userExists) {
            return {
                data: {
                    type: "fail",
                    message: "incorrect username",
                    user: {
                        email: userInputEmail
                    }
                }
            }
        }

        let db;
        let storedHashedPassword;
        //Get hashed password from database
        try {
            db = await database.getDb();

            const filter = { email: userInputEmail };
            const user = await db.users.findOne(filter);

            storedHashedPassword = user.password;
        } catch (e) {
            console.error('Error getting password from database:', e);
            return { error: "An error occurred while trying to get the password from database" };
        } finally {
            await db.client.close();
        }

        //Compare passwords. true or false.
        const passwordCorrect = await auth.comparePasswords(userInputPassword, storedHashedPassword);

        if (passwordCorrect) {
            //Password correct. Collect a jwt token.
            const payload = { email: userInputEmail };
            const secret = jwtSecret;

            const token = jwt.sign(payload, secret, { expiresIn: '1h'});

            return {
                data: {
                    type: "success",
                    message: "User successfully logged in",
                    user: {
                        email: userInputEmail
                    },
                    token: token
                }
            }
        }

        //Password was incorrect
        return {
            data: {
                type: "fail",
                message: "incorrect password",
                user: {
                    email: userInputEmail
                }
            }
        }
    },
    comparePasswords: async function comparePasswords(userInputPassword, storedHashedPassword) {
        try {
            const result = await bcrypt.compare(userInputPassword, storedHashedPassword);
            if (result) {
                // Passwords match, authentication successful. returns true
                // console.log('Passwords match! User authenticated.RESULT', result);
                return result;
            } else {
                // Passwords not a match, authentication failed. returns false
                // console.log('Passwords do not match! Authentication failed.', result);
                return result;
            }
        } catch (e) {
            console.error('Error comparing passwords:', e);
            return { error: "Error during password comparison" };
        }
    },
    checkToken: function checkToken(req, res, next) {
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(e, decoded) {
                if (e) {
                    // not a valid token
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: e.message
                        }
                    });
                }

                // Valid token proceed to next route
                req.user = { email: decoded.email};
                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
}

export default auth;
