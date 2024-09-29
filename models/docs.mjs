import database from '../db/database.mjs';
import { ObjectId } from 'mongodb';

const documents = {
    // Gets all documents in the collection
    getAll: async function getAll() {
        let db = await database.getDb();

        try {
            return await db.collection.find().toArray();
        } catch (e) {
            console.error(e);

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
            return await db.collection.findOne(documentId);
        } catch (e) {
            console.error(e);
            return {};
        } finally {
            await db.client.close();
        }
    },
    /**
     * Insert a new document into the collection.
     * @param {Object} body - The document data.
     * @param {string} body.title - The title of the document.
     * @param {string} body.content - The content of the document.
     * @returns {Promise} The result of the insert operation.
     */
    addOne: async function addOne(body) {
        let db = await database.getDb();

        try {
            return await db.collection.insertOne(body);
        } catch (e) {
            console.error(e);
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

        const result = await db.collection.updateOne(
            filter,
            updateDocument,
        );

        try {
            return result;
        } catch (e) {
            console.error(e);
        } finally {
            await db.client.close();
        }
    }
};

export default documents;
