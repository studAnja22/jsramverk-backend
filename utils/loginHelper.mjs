import 'dotenv/config'

import users from '../models/users.mjs';

const loginHelper = {
    checkUserInput: function checkUserInput(body) {
        const userInputEmail = body.email;
        const userInputPassword = body.password;

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
    },
    doesUserExist: async function doesUserExist(body) {
        const userExists = await users.emailExists(body);

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
    }
}

export default loginHelper;

