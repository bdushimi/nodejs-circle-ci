//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Profession = require('../app/models/profession');
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
describe('Professions', () => {
	beforeEach((done) => { //Before each test we empty the database
		Profession.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET profession', () => {
	  it('it should GET all the professions', (done) => {
			chai.request(server)
		    .get('/profession')
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

  describe('/POST profession', () => {
	
	it('it should not POST an profession without profession title field', (done) => {
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
		 .post('/profession')
		 .set('Authorization', token)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('welcomeMessage', 'hello welcome')
		 .attach('professionImage', fs.readFileSync('./test/malume.png'), 'malume.png')
	   .end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('professionTitle');
			res.body.errors.professionTitle.should.have.property('kind').eql('required');
		 done();
	  });
	});
   });
	//start
	it('it should POST an profession', (done) => {
		   chai.request(server)
			.post('/profession')
			.set('Authorization', token)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.field('welcomeMessage', 'Hello')
			.field('professionTitle', 'web dev')
			.attach('professionImage', fs.readFileSync('./test/malume.png'), 'malume.png')
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Profession successfully added!');
				res.body.profession.should.have.property('welcomeMessage');
				res.body.profession.should.have.property('professionTitle');
				res.body.profession.should.have.property('professionImage');
			done();
	     });
	  });
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id profession', () => {
	  it('it should GET a profession by the given id', (done) => {
	  	let profession = new Profession({ welcomeMessage: "Js", professionTitle: "JS is awsome", professionImage: "image to be"});
	  	profession.save((err, profession) => {
	  		chai.request(server)
			.get('/profession/' + profession.id)
			.set('Authorization', token)
		    .send(profession)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('welcomeMessage');
			  	res.body.should.have.property('professionTitle');
			  	res.body.should.have.property('professionImage');
			  	res.body.should.have.property('_id').eql(profession.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id profession', () => {
	it('it should UPDATE a profession given the id', (done) => {
		let profession = new Profession({welcomeMessage: "Java basics", professionTitle: "java", professionImage: "image hh"})
		profession.save((err, profession) => {
			  chai.request(server)
			  .put('/profession/' + profession.id)
			  .set('Authorization', token)
			  .send({welcomeMessage: "Java basics", professionTitle: "java", professionImage: "image lorem" })
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Profession updated!');
					res.body.profession.should.have.property('professionImage').eql("image lorem");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id profession', () => {
	it('it should DELETE a profession given the id', (done) => {
		let profession = new Profession({welcomeMessage: "node", professionTitle: "node.js", professionImage: "node image"})
		profession.save((err, profession) => {
			  chai.request(server)
			  .delete('/profession/' + profession.id)
			  .set('Authorization', token)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Profession successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});

  