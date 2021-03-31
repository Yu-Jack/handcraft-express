import request from "supertest";
import express from "../src/express";
import expcet from "assert";

describe("express test", () => {
    describe("Test Get Request", () => {
        describe("basic usage", () => {
            it("requset to path '/', and get the response text from '/'", (done) => {
                const app = express();
                app.get("/", (req, res) => {
                    res.end("hi");
                });
    
                request(app)
                    .get("/")
                    .expect(200, done);
            });

            it("request to first router, and should get response text from '/path1'", (done) => {
                const responseText1 = "hi1";
                const responseText2 = "hi2";
                const app = express();
    
                app.get("/path1", (req, res) => {
                    res.end(responseText1);
                });
                app.get("/path2", (req, res) => {
                    res.end(responseText2);
                });
    
                request(app)
                    .get("/path1")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText1);
                        done();
                    });
            });

            it("request to second router, and should get response text from '/path2'", (done) => {
                const responseText1 = "hi1";
                const responseText2 = "hi2";
                const app = express();
    
                app.get("/path1", (req, res) => {
                    res.end(responseText1);
                });
                app.get("/path2", (req, res) => {
                    res.end(responseText2);
                });
    
                request(app)
                    .get("/path2")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText2);
                        done();
                    });
            });

            
        });


        describe("middleware test", () => {
            it("two same path routers, and should get the response text from previous router", (done) => {
                const responseText = "hi";
                const app = express();
                app.get("/", (req, res, next) => {
                    req.data = responseText;
                    next();
                });
                app.get("/", (req, res) => {
                    res.end(req.data);
                });
    
                request(app)
                    .get("/")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText);
                        done();
                    });
            });
    
            it("one path router which one two middleware, and should get response text from previous middleware", (done) => {
                const responseText = "hi";
                const app = express();
                app.get("/", (req, res, next) => {
                    req.data = responseText;
                    next();
                }, (req, res) => {
                    res.end(req.data);
                });
    
                request(app)
                    .get("/")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText);
                        done();
                    });
            });  

            it("request to path '/' that have one app.use function, and should get the response text from app.use '/'", (done) => {
                const responseText = "hi";
                const app = express();
                app.use((req, res, next) => {
                    req.data = responseText;
                    next();
                });
                app.get("/", (req, res) => {
                    res.end(req.data);
                });
    
                request(app)
                    .get("/")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText);
                        done();
                    });
            });
    
            it("request to path '/' that have one app.use '/' function, and should get the response text from app.use '/'", (done) => {
                const responseText = "hi";
                const app = express();
                app.use("/", (req, res, next) => {
                    req.data = responseText;
                    next();
                });
                app.get("/", (req, res) => {
                    res.end(req.data);
                });
    
                request(app)
                    .get("/")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, responseText);
                        done();
                    });
            });
    
            it("requset to path '/', and there is a app.use '/path2/ middleware, and should get response text from '/'", (done) => {
                const responseText = "hi";
                const expectedText = "Happy";
                const app = express();
                app.use("/path2", (req, res, next) => {
                    req.data = responseText;
                    next();
                });
                app.get("/", (req, res) => {
                    req.data = !req.data ? expectedText : req.data;
                    res.end(req.data);
                });
    
                request(app)
                    .get("/")
                    .end((err, response) => {
                        expcet.deepStrictEqual(response.text, expectedText);
                        done();
                    });
            });
        });
    });
});