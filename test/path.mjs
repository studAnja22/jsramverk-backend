process.env.NODE_ENV = 'test';

import * as chaiModule from "chai";
import chaiHttp from 'chai-http/index.js';
import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);
const request = chai.request;

chai.should();

describe('Landing page', () => {
    describe('GET /', () => {
        it('200 HAPPY PATH getting base', (done) => {
            request.execute(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
                });
        });
    });
});

describe('Secret greeting', () => {
    describe('GET /hello', () => {
        it('200 HAPPY PATH get secret greeting', (done) => {
            request.execute(server)
                .get("/hello")
                .end((err, res) => {
                    res.should.have.status(200);

                    done();
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
