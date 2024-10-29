import database from '../db/database.mjs';
import bcrypt from 'bcryptjs';

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const user = {
    // Register new user
    register: async function register(body) {
        const email = body.email;
        const password = body.password;

        let db;
        //Check if user submitted email and password
        if (!email || !password) {
            return { error: "email or password missing" };
        }

        //Check if email is in database
        let checkEmail = await user.emailExists(body);
        
        if (checkEmail) {
            return { error: "Error: Email already in use" };
        };

        if (checkEmail == null ) {
            return { error: "Error: an error occurred while checking email" };
        }

        //Make password super secure with bcrypt
        try {
            const hash = await bcrypt.hash(password, saltRounds);

            db = await database.getDb();

            let newUser = {
                email: email,
                password: hash,
            }

            await db.users.insertOne(newUser);

            return { message: "User successfully registered" };
        } catch (e) {
            console.error("Error while adding user", e);
            return { error: "Error: an error occurred while trying to register user.", error: e.message }
        } finally {
            await db.client.close();
        }
    },
    emailExists: async function emailExists(body) {
        const email = body.email;

        let db;
        try {
            db = await database.getDb();

            const filter = { email: email };
            const foundEmail = await db.users.findOne(filter);

            //Email was found in the database
            if (foundEmail) {
                return true;
            }
            //Email not found in the database
            return false;
        } catch (e) {
            console.error("Error: an error occurred while checking if user email already in db");
            return null;
        } finally {
            await db.client.close();
        }
    }//Delete user and their documents??
}


export default user;
