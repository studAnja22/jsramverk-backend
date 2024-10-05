/* global it describe before */

process.env.NODE_ENV = 'test';

import * as chaiModule from "chai";
import chaiHttp from 'chai-http/index.js';
import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);
const request = chai.request;

chai.should();

import database from "../db/database.mjs";
const collectionName = "keys";

// Reset the database
describe('Reset the test-database 1', () => {
    before(() => {
        return database.getDb()
            .then(db => {
                return db.db.listCollections().toArray()
                    .then(collections => {
                        return Promise.all(collections.map(collection => {
                            return db.db.collection(collection.name).drop();
                        }));
                    })
                    .then(() => {
                        return db.db.listCollections().toArray()
                            .then(emptyDatabase => {
                                emptyDatabase.should.be.empty;
                            });
                    })
                    .catch(e => {
                        console.error(e);
                        throw e;
                    })
                    .finally(() => {
                        db.client.close();
                    });
            })
            .catch(e => {
                console.error("Unable to connect to database: ", e);
                throw e;
            });
    });
});

describe('reset database 2', () => {
    before(async () => {
        const db = await database.getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });
});

describe('reset database 3', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function(info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                })
                .finally(async function() {
                    await db.client.close();
                    resolve();
                });
        });
    });
});

describe('document path', () => {
    describe('GET /posts', () => {
        it('200 HAPPY PATH', (done) => {
            request.execute(server)
                .get("/posts")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});
