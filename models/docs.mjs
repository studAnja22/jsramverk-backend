import database from '../db/database.mjs';
import auth from './auth.mjs';
import timestamp from './timestamp.mjs';
import { ObjectId } from 'mongodb';

const documents = {
    // Gets all documents in the documents collection
    getAll: async function getAll() {
        let db = await database.getDb();

        try {
            return await db.documents.find().toArray();
        } catch (e) {
            console.error("Error during getAll operation:", e);

            return [];
        } finally {
            await db.client.close();
        }
    },
    getUsersDocuments: async function getUsersDocuments() {
        let db = await database.getDb();

        if( auth.user) {
            try {
                return await db.documents.find({
                $or: [
                    { owner: auth.user },
                    { allowed_users: auth.user }
                    ]
                }).toArray();
            } catch (e) {
                console.error("Error during getUsersDocuments operation:", e);

                return [];
            } finally {
                await db.client.close();
            }
        }
        console.error("Error trying to collect document. User not signed in", e);
        return {}
    },
    // finds and returns the document with id
    getOne: async function getOne(id) {
        let db = await database.getDb();

        const documentId = { _id: ObjectId.createFromHexString(id)};

        try {
            const foundDocument = await db.documents.findOne(documentId);
            return foundDocument;
        } catch (e) {
            console.error("Error during getOne operation:", e);
            throw new Error("Failed to retrieve document with id: ", documentId);
        } finally {
            await db.client.close();
        }
    },
    /**
     * Insert a new document into the documents collection.
     * @param {Object} body - The document data.
     * @param {string} body.title - The title of the document.
     * @param {string} body.content - The content of the document.
     * @returns {Promise} The result of the insert operation.
     */
    addOne: async function addOne(body, res) {
        const validToken = auth.isTokenValid();
        if (!validToken) {
            console.error("Token is not valid.")
            return res.status(401).json({
                message: "Token is not valid. Cannot add document to database."
            });;
        }
        const currentTime = timestamp.getCurrentTime();

        let db = await database.getDb();
        let data = {
            title: body.title,
            content: body.content,
            owner: auth.user,
            allowed_users: [],
            created: currentTime,
            last_update: "",
        }

        try {
            await db.documents.insertOne(data);
        } catch (e) {
            console.error("Error during addOne operation:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    },
    // Updates one title and content of a document
    updateOne: async function updateOne(body) {
        let db = await database.getDb();

        const currentTime = timestamp.getCurrentTime();
        const filter = { _id: ObjectId.createFromHexString(body["_id"]) };
        const updateDocument = {
            $set: {
                title: body.title,
                content: body.content,
                last_update: currentTime,
            },
        };

        try {
            return await db.documents.updateOne(
                filter,
                updateDocument,
            );
        } catch (e) {
            console.error("Internal server error while trying to update document");
        } finally {
            await db.client.close();
        }
    },
    // deletes a document with the id
    deleteOne: async function deleteOne(id) {
        let db = await database.getDb();
        const filter = { _id: ObjectId.createFromHexString(id) };

        try {
            const result = await db.documents.deleteOne(filter);

            return result;
        } catch (e) {
            console.error("Error during deleteOne operation:", e);
        } finally {
            await db.client.close();
        }
    },
    // Adds a user to the document. body.email, body._id
    addCollaborator: async function addCollaborator(body) {
        const db = await database.getDb();
        const filter = { _id: ObjectId.createFromHexString(body["_id"]) };
        const collaboratorEmail = body.email;

        let document;
        try {
            document = await db.documents.findOne(filter);
        } catch (e) {
            console.error("Error trying to find the document", e);
            throw new Error("Internal server Error");
        }

        const alreadyInAllowedUsers = await documents.inAllowedUsers(document, collaboratorEmail);

        if (alreadyInAllowedUsers) {
            //email is already in allowed_users
            return true;
        }

        //Email is not among allowed_users - add it.
        const addCollaborator = {
            $push: { allowed_users: collaboratorEmail }
        }

        try {
            await db.documents.updateOne(
                filter,
                addCollaborator,
            );

            return false;//Email was not in allowed_users and was successfully added.
        } catch (e) {
            console.error("Error during addCollaborator operation:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    },
    //Is the user in allowed_user? returns true or false
    inAllowedUsers: async function inAllowedUsers(document, email) {
        //User is in allowed_user. Return true.
        if (document.allowed_users && document.allowed_users.includes(email)) {
            return true;
        }
        //User is not in allowed_user. Return false.
        return false;
    },
    // Removes a user from the document. body.email, body._id
    removeCollaborator: async function removeCollaborator(body) {
        const db = await database.getDb();
        const filter = { _id: ObjectId.createFromHexString(body["_id"]) };
        const document = await db.documents.findOne(filter);
        const collaboratorEmail = body.email;

        const userExists = await this.inAllowedUsers(document, collaboratorEmail);
        if (!userExists) {
            //user not in allowed_users
            return false;
        }
        //User is in allowed_users and needs to be removed.
        const addCollaborator = {
            $pull: { allowed_users: collaboratorEmail }
        }

        try {
            await db.documents.updateOne(
                filter,
                addCollaborator,
            );

            return true;//Email has been removed.
        } catch (e) {
            console.error("Error during addCollaborator operation:", e);
            throw new Error("Internal server Error");
        } finally {
            await db.client.close();
        }
    }
};

export default documents;
