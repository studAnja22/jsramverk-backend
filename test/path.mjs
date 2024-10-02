process.env.NODE_ENV = 'test';

import * as chaiModule from "chai";
import chaiHttp from 'chai-http/index.js';
import server from "../app.mjs";

const chai = chaiModule.use(chaiHttp);
const request = chai.request;

chai.should();

describe('Reports', () => {
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
