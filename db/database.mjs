import 'dotenv/config'

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
    getDb: async function getDb () {
        let dsn;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";

        } else {
            dsn = `mongodb+srv://${process.env.DB_MONGO}:${process.env.DB_PASS}@text-editor.azo43.mongodb.net/?retryWrites=true&w=majority&appName=text-editor`;
        }

        // console.log("dsn:", dsn);

        const client = new MongoClient(dsn, {
            serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            }
        });

        try {
            await client.connect()
            const db = client.db();
            const documents = db.collection("documents");
            const users = db.collection("users");

            return {
                db: db,
                documents: documents,
                users: users,
                client: client,
            };
        } catch (e) {
            console.error("Unable to connect to database", e);
            throw e;
        }
    }
};

export default database;
