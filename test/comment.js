//During the test the env variable is set to test
process.env.NODE_ENV = 'test';


let mongoose = require("mongoose");
let Comment = require('../app/models/comment');
require("dotenv").config();

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const fs = require('fs');


chai.use(chaiHttp);

//Our parent block
describe('Comments', () => {
	beforeEach((done) => { //Before each test we empty the database
		Comment.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET comment', () => {
	  it('it should GET all the comments', (done) => {
			chai.request(server)
		    .get('/comment')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(0);
		      done();
		    });
	  });

	  
  });

   /*
  	* Test the /POST route
  */

  describe('/POST comment', () => {
	
	it('it should not POST an comment without email field', (done) => {
		chai.request(server)
		 .post('/comment')
		 .set('Authorization', 'Bearer ' + process.env.authenticationToken)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('article_id', 'idididididdi')
		 .field('names', 'kabano')
		 .field('comment', 'lorem ipsum')
	   .end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('email');
			res.body.errors.email.should.have.property('kind').eql('required');
		 done();
	  });
   });
	//start
	// it('it should POST a comment', (done) => {
	// 	   chai.request(server)
	// 		.post('/comment')
	// 		.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtlbGx5QGdtYWlsLmNvbSIsInVzZXJJZCI6IjVmN2FjMDRlM2M5MGFlYWI0YTYxYmNhZCIsImlhdCI6MTYwMTkxMDU4MCwiZXhwIjoxNjAxOTE0MTgwfQ.bUZFlGdd9UM2ECRS4oE3BMfpV6vQwcFvX2tFXZBvbFY')
	// 		.set('Content-Type', 'application/x-www-form-urlencoded')
	// 		.field('names', 'kabano')
	// 		.field('email', 'kabano@gmail.com')
	// 	 	.field('subject', 'lorem ipsum')
	// 	 	.field('message', 'lorem ipsum')
	// 	  .end((err, res) => {
	// 			res.should.have.status(200);
	// 			res.body.should.be.a('object');  
	// 			res.body.should.have.property('message').eql('Comment successfully added!');
	// 			res.body.comment.should.have.property('names');
	// 			res.body.comment.should.have.property('email');
	// 			res.body.comment.should.have.property('subject');
	// 			res.body.comment.should.have.property('message');
	// 		done();
	//      });
	//   });

	  it('it should POST a comment ', (done) => {
		let comment = {
			article_id: "iidididi",
			names: "kabano",
			email: "kabano@gmail.com",
			comment: "lorem"
		}
		  chai.request(server)
		  .post('/comment')
		  .set('Authorization', 'Bearer ' + process.env.authenticationToken)
		  .send(comment)
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Comment successfully added!');
				res.body.comment.should.have.property('article_id');
				res.body.comment.should.have.property('names');
				res.body.comment.should.have.property('email');
				res.body.comment.should.have.property('comment');
			done();
		  });
	});
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id comment', () => {
	  it('it should GET a comment by the given id', (done) => {
	  	let comment = new Comment({ article_id: "akakakak", names: "kabano", email: "kabano@gmail.com", comment: "lorem"});
	  	comment.save((err, comment) => {
	  		chai.request(server)
			.get('/comment/' + comment.id)
			.set('Authorization', 'Bearer ' + process.env.authenticationToken)
		    .send(comment)
		    .end((err, res) => {
			  	res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('article_id');
			  	res.body.should.have.property('names');
			  	res.body.should.have.property('email');
				res.body.should.have.property('comment');
			  	res.body.should.have.property('_id').eql(comment.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id comment', () => {
	it('it should UPDATE a comment given the id', (done) => {
		let comment = new Comment({ article_id: "akakakak", names: "kabano", email: "kabano@gmail.com", comment: "lorem"})
		comment.save((err, comment) => {
			  chai.request(server)
			  .put('/comment/' + comment.id)
			  .set('Authorization', 'Bearer ' + process.env.authenticationToken)
			  .send({ article_id: "akakakak", names: "kabano", email: "kabano@gmail.com", comment: "lorem ipsum"})
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Comment updated!');
					res.body.comment.should.have.property('names').eql("kabano");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id comment', () => {
	it('it should DELETE a comment given the id', (done) => {
		let comment = new Comment({ article_id: "akakakak", names: "kabano", email: "kabano@gmail.com", comment: "lorem"})
		comment.save((err, comment) => {
			  chai.request(server)
			  .delete('/comment/' + comment.id)
			  .set('Authorization', 'Bearer ' + process.env.authenticationToken)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Comment successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});

  