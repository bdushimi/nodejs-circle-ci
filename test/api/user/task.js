let chai = require("chai");
let chaiHttp = require("chai-http");
//api
//let server = require("../../../server");

//the app we are testing
const server = require('../../../api/routes/articles');


//db
const conn = require('../../../db/db.js');

//Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Articles API', () => {
    // Test Get route
    describe("GET /articles", () => {

        before((done) => {
            conn.connect()
               .then(() => done())
               .catch((err) => done(err));
        })
    
        after((done) => {
            conn.close()
               .then(() => done())
               .catch((err) => done(err));
        })

        it("it should GET all the articles", (done) => {
            chai.request(server)
                .get("/articles")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eq(3);
                done();
                });
        });

        it("it should NOT GET all the articles", (done) => {
            chai.request(server)
                .get("/articles")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });
    });

    // get by id
    describe("Get /articles/:id", () => {
        it("it should GET an article by ID", (done) => {
            const articleId = "5f74be3eceacd099238f1b3b";
            chai.request(server)
                .get("/articles/" + articleId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.propert('id');
                    response.body.should.have.propert('title');
                    response.body.should.have.propert('content');
                    response.body.should.have.propert('articleImage');
                    response.body.should.have.propert('id').eq('5f74be3eceacd099238f1b3b');
                done();
                });
        });

    })
});