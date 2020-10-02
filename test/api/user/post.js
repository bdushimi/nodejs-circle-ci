const expect = require('chai').expect;
const request = require('supertest');

//the app we are testing
const app = require('../../../api/routes/articles');

//db
const conn = require('../../../db/db.js');

describe('POST /articles', () => {
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

    //test
    it('OK, creating a new article', (done) => {
        request(app).post('/articles')
           .send({ title: 'css', content: 'css', articleImage: 'kdkdkd'})
           .then((res) => {
               const body = res.body;
               expect(body).to.contain.property('_id');
               expect(body).to.contain.property('title');
               expect(body).to.contain.property('content');
               expect(body).to.contain.property('articleImage');
               done();
           })
    })
})
