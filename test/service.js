//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Service = require('../app/models/service');
require("dotenv").config();

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const fs = require('fs');


chai.use(chaiHttp);

//Our parent block
describe('Services', () => {
	beforeEach((done) => { //Before each test we empty the database
		Service.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET service', () => {
	  it('it should GET all the services', (done) => {
			chai.request(server)
		    .get('/service')
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

  describe('/POST service', () => {
	
	it('it should not POST an service without title field', (done) => {
		chai.request(server)
		 .post('/service')
		 .set('Authorization', 'Bearer ' + process.env.authenticationToken)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('content', 'html is awesomee')
		 .attach('serviceImage',
		   fs.readFileSync('/home/kabano/amafoto/malume.png'), 'malume.png')
	   .end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('title');
			res.body.errors.title.should.have.property('kind').eql('required');
		 done();
	  });
   });
	//start
	it('it should POST an service', (done) => {
		   chai.request(server)
			.post('/service')
			.set('Authorization', 'Bearer ' + process.env.authenticationToken)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.field('title', 'html')
			.field('content', 'html is awesomee')
			.attach('serviceImage',
			  fs.readFileSync('/home/kabano/amafoto/malume.png'), 'malume.png')
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Service successfully added!');
				res.body.service.should.have.property('title');
				res.body.service.should.have.property('content');
				res.body.service.should.have.property('serviceImage');
			done();
	     });
	  });
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id service', () => {
	  it('it should GET a service by the given id', (done) => {
	  	let service = new Service({ title: "Js", content: "JS is awsome", serviceImage: "image to be"});
	  	service.save((err, service) => {
	  		chai.request(server)
			.get('/service/' + service.id)
			.set('Authorization', 'Bearer ' + process.env.authenticationToken)
		    .send(service)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('title');
			  	res.body.should.have.property('content');
			  	res.body.should.have.property('serviceImage');
			  	res.body.should.have.property('_id').eql(service.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id service', () => {
	it('it should UPDATE a service given the id', (done) => {
		let service = new Service({title: "Java basics", content: "java", serviceImage: "image hh"})
		service.save((err, service) => {
			  chai.request(server)
			  .put('/service/' + service.id)
			  .set('Authorization', 'Bearer ' + process.env.authenticationToken)
			  .send({title: "Java basics", content: "java", serviceImage: "image lorem" })
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Service updated!');
					res.body.service.should.have.property('serviceImage').eql("image lorem");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id service', () => {
	it('it should DELETE a service given the id', (done) => {
		let service = new Service({title: "node", content: "node.js", serviceImage: "node image"})
		service.save((err, service) => {
			  chai.request(server)
			  .delete('/service/' + service.id)
			  .set('Authorization', 'Bearer ' + process.env.authenticationToken)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Service successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});

  