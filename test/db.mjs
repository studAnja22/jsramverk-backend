/* global it describe before */

process.env.NODE_ENV = 'test';

import * as chaiModule from "chai";
import chaiHttp from 'chai-http/index.js';
import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);
const request = chai.request;

chai.should();

import database from "../db/database.mjs";
const collectionName = "tests";

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

    it('Should reset the database and be empty', async () => {
        const db = await database.getDb();
        const collection = await db.db.listCollections().toArray();
        collection.should.be.empty;
    });
});
// Check the POST route - ADD a new document
// describe('POST /posts - Add a new document', () => {
//     it('Should add a new document and return 201 status', async (done) => {
//         const document = {
//         title: "Awesome title",
//         content: "Creative content."
//     };

//     await request.execute(server)
//         .post("/posts")
//         .send(document)
//         .end((err, res) => {
//             res.should.have.status(201);
//             res.body.should.have.property('message').eql('Document added successfully');
//             res.body.should.have.property('document');
//             res.body.document.should.have.property('_id');
//             res.body.document.should.have.property('title').eql(document.title);
//             res.body.document.should.have.property('content').eql(document.content);
//             done();
//         });
//     });
// });
// // Check GET route. can we get the document we added by id?
// describe('GET /posts/:id - Get document with id', () => {
//     it('Should return document with id with status 200', async (done) => {
//         const db = await database.getDb();
//         const documents = await db.collection.find({}).toArray();

//         const firstDocument = documents[0];

//         firstDocument.should.exist;
//         firstDocument.should.have.property('_id');
//         firstDocument.should.have.property('title');
//         firstDocument.should.have.property('content');


//         const documentId = firstDocument._id;
//         const documentTitle = firstDocument.title;
//         const documentContent = firstDocument.content;


//     request.execute(server)
//         .get(`/posts/${documentId}`)
//         .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.have.property('_id').eql(`${documentId}`);
//             res.body.should.have.property('title').eql(`${documentTitle}`);
//             res.body.should.have.property('content').eql(`${documentContent}`);
//             res.body.should.be.a('object');
//             done();
//         });
//     });
// });
// // Check POST route - UPDATE. can we update the document we added by id?
// describe('POST /posts/update - Update the document by id', () => {
//     it('Should update the document with new content and return status 200', async (done) => {
//         const db = await database.getDb();
//         const documents = await db.collection.find({}).toArray();
//         const firstDocument = documents[0];
//         const documentId = firstDocument._id;

//         const updatedDocument = {
//             _id: documentId,
//             title: "A significantly better title",
//             content: "Simply the best content"
//         };

//         request.execute(server)
//         .post(`/posts/update`)
//         .send(updatedDocument)
//         .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.have.property('message').eql('Document updated successfully');
//             res.body.should.have.property('_id').eql(`${documentId}`);
//             res.body.should.have.property('title').eql(`${updatedDocument.title}`);
//             res.body.should.have.property('content').eql(`${updatedDocument.content}`);
//             res.body.should.be.a('object');
//             done();
//         });
//     });
// });
// // Check DELETE route. Can we destroy what we've created by id?
// describe('DELETE /posts/delete', () => {
//     it('Should delete the document and return status 200', async (done) => {
//         const db = await database.getDb();
//         const documents = await db.collection.find({}).toArray();
//         const firstDocument = documents[0];
//         const documentId = firstDocument._id;

//         request.execute(server)
//         .delete(`/posts/delete`)
//         .send(documentId)
//         .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.have.property('message').eql('Document deleted successfully');
//             res.body.should.have.property('id').eql(documentId);
//             done();
//         });
//     });
// });
