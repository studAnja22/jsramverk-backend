import database from '../db/database.mjs';
import bcrypt from 'bcryptjs';
import timestamp from '../utils/timestamp.mjs';
import auth from './auth.mjs';

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
            const currentTime = timestamp.getCurrentTime();

            db = await database.getDb();

            let newUser = {
                email: email,
                password: hash,
                account_created: currentTime
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
    },
    deregister: async function deregister(req, res) {
        const email = req.body.email;

        //Check if user submitted email
        if (!email) {
            throw new Error("Error 404: Email is missing");
        }

        try {
            // Remove all the users data
            await user.removeFromCollaborations(email);
            await user.removeUser(email);
            await user.removeAllUsersDocuments(email);

            return res.status(200).json({ message: "User deregistered successfully." });
        } catch (e) {
            console.error("Error during deregistration:", error);
            return res.status(500).json({ error: "An error occurred during deregistration." });
        }
    },
    removeFromCollaborations: async function removeFromCollaborations(userEmail) {
        let db;

        try {
            db = await database.getDb();

            const filterCollaborator = {
                allowed_users: userEmail
            }
            const updateCollaboration = {
                $pull: { allowed_users: userEmail }
            }

            await db.documents.updateMany(filterCollaborator, updateCollaboration);
        } catch (e) {
            console.error("An error occurred while trying to remove user from all allowed_users:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    },
    removeUser: async function removeUser(userEmail) {
        let db;

        try {
            db = await database.getDb();

            const filterUser = {
                email: userEmail
            }

            await db.users.deleteOne(filterUser);
        } catch (e) {
            console.error("An error occurred while trying to delete the user:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    },
    removeAllUsersDocuments: async function removeAllUsersDocuments(userEmail) {
        let db;

        try {
            db = await database.getDb();

            const filterDocuments = {
                owner: userEmail
            }

            await db.documents.deleteMany(filterDocuments);
        } catch (e) {
            console.error("An error occurred while trying to delete all users documents:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    }
}


export default user;
