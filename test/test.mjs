/* global it describe before */

process.env.NODE_ENV = 'test';

import chaiModule from 'chai';
import chaiHttp from 'chai-http';
import { describe } from "mocha";

import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);

chai.should();

import database from "../db/database.mjs";

const collectionNameDocuments = "test_document";
const collectionNameUsers = "test_user";
let jwtToken = "";
let oldToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkhlbGxvWW91QGVtYWlsLmNvbSIsImlhdCI6MTczMDc0MzAwMCwiZXhwIjoxNzMwNzQ2NjAwfQ.zJ29H0w1hgi7QsXiE4zaZGn80sTjnBxvq3i8leIk488";

describe('CRUD Operations Documents & Users', () => {
    let db = "";
    // Reset database and setup for the tests
    before(async () => {
        //Trying to access the database
        try {
            db = await database.getDb();
            console.log("Database initialized:", db);
        } catch (e) {
            console.error("Error during database initialization:", e);
        }

        try {
            //Get all collections and drop them.
            const collections = await db.listCollections().toArray();

            for (const collectionInfo of collections) {
                await db.collection(collectionInfo.name).drop();
            }
        } catch (e) {
            console.error("Error occurred while trying to drop test collections", e);
        }

        try {
            //Create test collections for documents and users
            const collectionDocumentsExists = await db.listCollections({ name: collectionNameDocuments }).hasNext();
            const collectionUsersExists = await db.listCollections({ name: collectionNameUsers }).hasNext();

            if (!collectionDocumentsExists && !collectionUsersExists) {
                await db.createCollection(collectionNameDocuments);
                await db.createCollection(collectionNameUsers);
            }
        } catch (e) {
            console.error("Error occurred while trying to create test collections", e);
        }
    });

    describe('User Registration', () => {
        it('Should register a new user (register_user)', async () => {
            //Test for registering a new user
            const test_user = {
                email: "test@email.com",
                password: "regularPassword"
            }

            //Register new user
            const res = await chai.request.execute(server)
                .post("/users/register_user")
                .send(test_user);

            //Assertion
            res.should.have.status(201);

            res.body.should.have.property("message").eql("Successfully registered new user.");
        });

        it('Should fail if email already registered (register_user)', async () => {
            // Test for error handling duplicate registration
            const test_user = {
                email: "test@email.com",
                password: "regularPassword"
            }

            //Register the same user twice
            const res = await chai.request.execute(server)
                .post("/users/register_user")
                .send(test_user);

            //Assertion
            res.should.have.status(400);

            res.body.should.have.property("message").eql("Error: Email already in use");
        });

        it('Should fail if no password is provided (login)', async () => {
            //Test for error handling for missing parameter
            const test_user = {
                email: "test@email.com",
                password: ""
            }

            //We attempt to register the same user, but without all parameters
            const res = await chai.request.execute(server)
                .post("/auth/login")
                .send(test_user);

            //Assertion
            res.should.have.status(400);

            res.body.should.have.property("message").eql("email or password missing");
        });

        it('Should fail login if email not in database (login)', async () => {
            //User tries to login with unregistered email
            const test_user = {
                email: "wrong@email.com",
                password: "justPassword"
            }

            //Register the same user twice
            const res = await chai.request.execute(server)
                .post("/auth/login")
                .send(test_user);

            //Assertion
            res.should.have.status(400);

            res.body.should.have.property("message").eql("incorrect username");
        });

        it('Should fail login if wrong password (login)', async () => {
            //User submits the wrong password - error handling
            const test_user = {
                email: "test@email.com",
                password: "justPassword"
            }

            //Register the same user twice
            const res = await chai.request.execute(server)
                .post("/auth/login")
                .send(test_user);

            //Assertion
            res.should.have.status(400);

            res.body.should.have.property("message").eql("incorrect password");
        });

        it('Should login the user (login)', async () => {
            //User login with correct email and password
            const test_user = {
                email: "test@email.com",
                password: "regularPassword"
            }

            //Register the same user twice
            const res = await chai.request.execute(server)
                .post("/auth/login")
                .send(test_user);

            //Assertion
            res.should.have.status(201);

            res.body.should.have.property("message").eql("User successfully logged in");
            res.body.should.have.property("token");
            jwtToken = res.body.token;
        });
    });

    describe('CRUD documents', () => {
        beforeEach(() => {
            //Set the jwt token in header.
            chai.request.execute(server).set("x-access-token", jwtToken);
        });

        it('Should add document (addOne)', async () => {
            //Document title and content
            const document = {
                title: "Document Title",
                content: "Document Content"
            };

            const res = await chai.request.execute(server)
            .post("/posts/")
            .send(document);

            res.should.have.status(201);
            res.body.should.have.property('message').eql('Document added successfully');
        });

        it('Should fail if invalid token (addOne)', async () => {
            chai.request.execute(server).set("x-access-token", oldToken);

            const document = {
                title: "Document Title",
                content: "Document Content"
            };

            const res = await chai.request.execute(server)
            .post("/posts/")
            .send(document);

            res.should.have.status(401);
            res.body.should.have.property('message').eql('Token is not valid. Cannot add document to database.');
        });

        it('Should get the users documents (getUsersDocuments)', async () => {
            const res = await chai.request.execute(server)
                .post("/posts/get_documents");
            
            //Should only be one document
            res.should.have.status(401);
            res.body.should.be.an('array').that.has.lengthOf(1);
        })
    })

    after(async () => {
        // Close database
        await db.client.close();
    });
});
