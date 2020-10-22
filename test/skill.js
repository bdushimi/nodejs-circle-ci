//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Skill = require('../app/models/skill');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const fs = require('fs');


chai.use(chaiHttp);
let token = '';

//Our parent block
describe('Skills', () => {
	beforeEach((done) => { //Before each test we empty the database
		Skill.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET skill', () => {
	  it('it should GET all the skills', (done) => {
			chai.request(server)
		    .get('/skill')
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

  describe('/POST skill', () => {
	
	it('it should not POST a skill without title field', (done) => {
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
		 .post('/skill')
		 .set('Authorization', token)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('content', 'html is awesomee')
		 .attach('skillImage', fs.readFileSync('./test/malume.png'), 'malume.png')
	   .end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.have.property('errors');
			res.body.errors.should.have.property('title');
			res.body.errors.title.should.have.property('kind').eql('required');
		 done();
	  });
	});
   });
	//start
	it('it should POST an skill', (done) => {
		   chai.request(server)
			.post('/skill')
			.set('Authorization', token)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.field('title', 'html')
			.field('content', 'html is awesomee')
			.attach('skillImage', fs.readFileSync('./test/malume.png'), 'malume.png')
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Skill successfully added!');
				res.body.skill.should.have.property('title');
				res.body.skill.should.have.property('content');
				res.body.skill.should.have.property('skillImage');
			done();
	     });
	  });
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id skill', () => {
	  it('it should GET a skill by the given id', (done) => {
	  	let skill = new Skill({ title: "Js", content: "JS is awsome", skillImage: "image to be"});
	  	skill.save((err, skill) => {
	  		chai.request(server)
			.get('/skill/' + skill.id)
			.set('Authorization', token)
		    .send(skill)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('title');
			  	res.body.should.have.property('content');
			  	res.body.should.have.property('skillImage');
			  	res.body.should.have.property('_id').eql(skill.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id skill', () => {
	it('it should UPDATE a skill given the id', (done) => {
		let skill = new Skill({title: "Java basics", content: "java", skillImage: "image hh"})
		skill.save((err, skill) => {
			  chai.request(server)
			  .put('/skill/' + skill.id)
			  .set('Authorization', token)
			  .send({title: "Java basics", content: "java", skillImage: "image lorem" })
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Skill updated!');
					res.body.skill.should.have.property('skillImage').eql("image lorem");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id skill', () => {
	it('it should DELETE a skill given the id', (done) => {
		let skill = new Skill({title: "node", content: "node.js", skillImage: "node image"})
		skill.save((err, skill) => {
			  chai.request(server)
			  .delete('/skill/' + skill.id)
			  .set('Authorization', token)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Skill successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});

  