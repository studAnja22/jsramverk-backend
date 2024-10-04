import 'dotenv/config'

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://${process.env.DB_MONGO}:${process.env.DB_PASS}@text-editor.azo43.mongodb.net/?retryWrites=true&w=majority&appName=text-editor`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        console.log("dsn after if statement", dsn);

        const client = new MongoClient(dsn, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });
        const db = await client.db();
        const collection = await db.collection("documents");

        return {
            collection: collection,
            client: client,
        };
    }
};

export default database;
