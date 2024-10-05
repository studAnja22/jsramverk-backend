
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
describe('Reset the test-database', () => {
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

// Check the POST route - ADD a new document
describe('POST /posts - Add a new document', () => {
    it('Should add a new document and return 201 status', async () => {
        const document = {
        title: "Awesome title",
        content: "Creative content."
    };
    // Add the new document to the database
    const res = await request.execute(server)
        .post("/posts")
        .send(document)
        .expect(201);

    //Assertion
    res.should.have.status(201);
    res.body.should.have.property('message').eql('Document added successfully');
    res.body.should.have.property('document');
    res.body.document.should.have.property('_id');
    res.body.document.should.have.property('title').eql(document.title);
    res.body.document.should.have.property('content').eql(document.content);
    });
});
// Check GET route. can we get the document we added by id?
describe('GET /posts/:id - Get document with id', () => {
    it('Should return document with id with status 200', async () => {
        const db = await database.getDb();
        const documents = await db.collection.find({}).toArray();

        const firstDocument = documents[0];

        if (!firstDocument) {
            throw new Error('Database empty. No document to be updated');
        }

        firstDocument.should.exist;
        firstDocument.should.have.property('_id');
        firstDocument.should.have.property('title');
        firstDocument.should.have.property('content');


        const documentId = firstDocument._id;
        const documentTitle = firstDocument.title;
        const documentContent = firstDocument.content;

        // Get document with the id
        const res = await request(server)
            .get(`/posts/${documentId}`)
            .expect(200);
        
        // Assertion
        res.body.should.have.property('_id').eql(`${documentId}`);
        res.body.should.have.property('title').eql(`${documentTitle}`);
        res.body.should.have.property('content').eql(`${documentContent}`);
        res.body.should.be.a('object');
    });
});
// Check POST route - UPDATE. can we update the document we added by id?
describe('POST /posts/update - Update the document by id', () => {
    it('Should update the document with new content and return status 200', async () => {
        const db = await database.getDb();
        const documents = await db.collection.find({}).toArray();
        const firstDocument = documents[0];

        if (!firstDocument) {
            throw new Error('Database empty. No document to be updated');
        }
        const documentId = firstDocument._id.toHexString();

        const updatedDocument = {
            _id: documentId,
            title: "A significantly better title",
            content: "Simply the best content"
        };
        // Update the document
        const res = await request(server)
            .post(`/posts/update`)
            .send(updatedDocument)
            .expect(200);

        // Assertion
        res.body.should.have.property('message').eql('Document updated successfully');
        res.body.should.have.property('_id').eql(`${documentId}`);
        res.body.should.have.property('title').eql(`${updatedDocument.title}`);
        res.body.should.have.property('content').eql(`${updatedDocument.content}`);
        res.body.should.be.a('object');

    });
});
// Check DELETE route. Can we destroy what we've created by id?
describe('DELETE /posts/delete', () => {
    it('Should delete the document and return status 200', async () => {
        const db = await database.getDb();
        const documents = await db.collection.find({}).toArray();
        const firstDocument = documents[0];

        if (!firstDocument) {
            throw new Error('Database empty. No document to be deleted');
        }
        const documentId = firstDocument._id.toHexString();

        // Destroy the document once and for all
        const res = await request(server)
            .delete(`/posts/delete/${documentId}`)
            .expect(200);

        // Assertion
        res.body.should.have.property('message').eql('Document deleted successfully');
        res.body.should.have.property('id').eql(documentId);
    });
});
