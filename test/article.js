//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Article = require('../app/models/article');
require("dotenv").config();

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect();
const fs = require('fs');


chai.use(chaiHttp);

//to hold the token
let token = '';

//Our parent block
describe('Articles', () => {
	beforeEach((done) => { //Before each test we empty the database
		Article.remove({}, (err) => { 
		   done();		   
		});		
	});
 /*
  * Test the /GET route
  */
  describe('/GET article', () => {
	  it('it should GET all the articles', (done) => {
			chai.request(server)
			.get('/article')
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

  describe('/POST article', () => {

	it('it should not POST an article without title field', (done) => {
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
		 .post('/article')
		 .set('Authorization', token)
		 .set('Content-Type', 'application/x-www-form-urlencoded')
		 .field('content', 'html is awesomee')
		 .attach('articleImage',
		   fs.readFileSync('./test/malume.png'), 'malume.png')
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
   //end here
	//start
	it('it should POST an article', (done) => {
		   chai.request(server)
			.post('/article')
			.set('Authorization', token)
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.field('title', 'html')
			.field('content', 'html is awesomee')
			.attach('articleImage', 
			  fs.readFileSync('./test/malume.png'), 'malume.png')
		  .end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('Article successfully added!');
				res.body.article.should.have.property('title');
				res.body.article.should.have.property('content');
				res.body.article.should.have.property('articleImage');
			done();
	     });
	  });
	});
	//end it
/*
  * Test the /GET/:id route
  */
  describe('/GET/:id article', () => {
	  it('it should GET an article by the given id', (done) => {
	  	let article = new Article({ title: "Js", content: "JS is awsome", articleImage: "image to be"});
	  	article.save((err, article) => {
	  		chai.request(server)
			.get('/article/' + article.id)
			.set('Authorization', token)
		    .send(article)
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('object');
			  	res.body.should.have.property('title');
			  	res.body.should.have.property('content');
			  	res.body.should.have.property('articleImage');
			  	res.body.should.have.property('_id').eql(article.id);
		      done();
		    });
	  	});
			
	  });
  });

  /*
  * Test the /PUT/:id route
  */
 describe('/PUT/:id article', () => {
	it('it should UPDATE an article given the id', (done) => {
		let article = new Article({title: "Java basics", content: "java", articleImage: "image hh"})
		article.save((err, article) => {
			  chai.request(server)
			  .put('/article/' + article.id)
			  .set('Authorization', token)
			  .send({title: "Java basics", content: "java", articleImage: "image lorem" })
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Article updated!');
					res.body.article.should.have.property('articleImage').eql("image lorem");
				done();
			  });
		});
	});
});
/*
* Test the /DELETE/:id route
*/
describe('/DELETE/:id article', () => {
	it('it should DELETE an article given the id', (done) => {
		let article = new Article({title: "node", content: "node.js", articleImage: "node image"})
		article.save((err, article) => {
			  chai.request(server)
			  .delete('/article/' + article.id)
			  .set('Authorization', token)
			  .end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Article successfully deleted!');
					res.body.result.should.have.property('ok').eql(1);
					res.body.result.should.have.property('n').eql(1);
				done();
			  });
		});
	});
});


});


  