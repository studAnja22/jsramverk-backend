import database from '../db/database.mjs';
import auth from './auth.mjs';
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
    // finds and returns the document with id
    getOne: async function getOne(id) {
        let db = await database.getDb();

        const documentId = { _id: ObjectId.createFromHexString(id)};

        try {
            return await db.documents.findOne(documentId);
        } catch (e) {
            console.error("Error during getOne operation:", e);
            return {};
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

        let db = await database.getDb();
        let data = {
            title: body.title,
            content: body.content,
            owner: auth.user,
            allowed_users: [],
        }

        try {
            return await db.documents.insertOne(data);
        } catch (e) {
            console.error("Error during addOne operation:", e);
            return res.status(500).json({ message: "Internal Server Error" });
        } finally {
            await db.client.close();
        }
    },
    // Updates one document
    updateOne: async function updateOne(body) {
        let db = await database.getDb();

        const filter = { _id: ObjectId.createFromHexString(body["_id"]) };
        const updateDocument = {
            $set: {
                title: body.title,
                content: body.content,
            },
        };

        try {
            const result = await db.documents.updateOne(
                filter,
                updateDocument,
            );

            return result;
        } catch (e) {
            console.error("Error during updateOne operation:", e);
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
    }
};

export default documents;
