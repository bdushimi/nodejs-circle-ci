//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Querie = require('../app/models/querie');
require("dotenv").config();

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const fs = require('fs');


chai.use(chaiHttp);
//to hold the token
let token = '';

//Our parent block
describe('Queries', () => {
	beforeEach((done) => { //Before each test we empty the database
		Querie.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET querie', () => {
	  it('it should GET all the queries', (done) => {
			chai.request(server)
		    .get('/querie')
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

  describe('/POST querie', () => {
	
	it('it should not POST an querie without email field', (done) => {
		//Mock login
		const valid_input = {
			"email": "john@gmail.com",
			"password": "secret"
		}
		//send login
		chai.request(server).post('/user/login')
			.send(valid_input)
			.then((login_response) => {
			//add token
			token = 'Bearer ' + login_response.body.token;

		chai.request(server)
		 .post('/querie')
		 .set('Authorization', token)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('names', 'kabano')
		 .field('subject', 'lorem ipsum')
		 .field('message', 'lorem ipsum')
	   .end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('email');
			res.body.errors.email.should.have.property('kind').eql('required');
		 done();
	  });
	});
   });
	//start
	  it('it should POST a querie ', (done) => {
		let querie = {
			names: "kabano",
			email: "kabano@gmail.com",
			subject: "lorem",
			message: "ipsum"
		}
		  chai.request(server)
		  .post('/querie')
		  .set('Authorization', token)
		  .send(querie)
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Querie successfully added!');
				res.body.querie.should.have.property('names');
				res.body.querie.should.have.property('email');
				res.body.querie.should.have.property('subject');
				res.body.querie.should.have.property('message');
			done();
		  });
	});
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id querie', () => {
	  it('it should GET a querie by the given id', (done) => {
	  	let querie = new Querie({ names: "kabano", email: "kabano@gmail", subject: "lorem", message: "lorem"});
	  	querie.save((err, querie) => {
	  		chai.request(server)
			.get('/querie/' + querie.id)
			.set('Authorization', token)
		    .send(querie)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('names');
			  	res.body.should.have.property('email');
				res.body.should.have.property('subject');
				res.body.should.have.property('message');
			  	res.body.should.have.property('_id').eql(querie.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id querie', () => {
	it('it should UPDATE a querie given the id', (done) => {
		let querie = new Querie({ names: "kabano", email: "kabano@gmail", subject: "lorem", message: "lorem"})
		querie.save((err, querie) => {
			  chai.request(server)
			  .put('/querie/' + querie.id)
			  .set('Authorization', token)
			  .send({ names: "kabano", email: "kabano@gmail", subject: "lorem hahha", message: "lorem"})
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Querie updated!');
					res.body.querie.should.have.property('names').eql("kabano");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id querie', () => {
	it('it should DELETE a querie given the id', (done) => {
		let querie = new Querie({ names: "kabano", email: "kabano@gmail", subject: "lorem", message: "lorem"})
		querie.save((err, querie) => {
			  chai.request(server)
			  .delete('/querie/' + querie.id)
			  .set('Authorization', token)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Querie successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});

  