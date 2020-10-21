//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
/**
 * test/test.js
 * All endpoint tests for the auth API
 */

const chai = require('chai');
const expect = chai.expect;
const server = require('../server');

//chai-http used to send async requests to our server
const http = require('chai-http');
chai.use(http);

//import User model
const User = require('../app/models/user');

//bcrypt
const bcrypt = require('bcrypt');

//token
let token = '';

describe('App basic tests', () => {
  
  before( (done) => {
    //delete all users 
    User.find().deleteMany().then( res => {
      console.log('Users removed');
      done();
    }).catch(err => {
      console.log(err.message);
    });
  });
  

  it('Should exists', () => {
    expect(server).to.be.a('function');
  })

  
  it('Returns 404 error for non defined routes', (done) => {
    chai.request(server).get('/unexisting').then((res) => {
      expect(res).to.have.status(404);
      done();
    });
  });
})

describe('User registration', () => {
  it('should return 201 and confirmation for valid input', (done) => {
    //mock valid user input
    let user_input = {
      "email": "john@gmail.com",
      "password": "secret"
    }
    //send /POST request to /register
    chai.request(server).post('/user/signup').send(user_input).then(res => {
      //validate
      expect(res).to.have.status(201);
      expect(res.body.message).to.be.equal('User registered');
      //new validations to confirm user is saved in database
      expect(res.body.user._id).to.exist;
      expect(res.body.user.createdAt).to.exist;
      //validation to confirm password is encrypted
      expect(res.body.user.password).to.not.be.eql(user_input.password);

      //done after all assertions pass
      done();
    }).catch(err => {
      console.log(err);
    });
  })

    it('should return 401 for invalid email input', (done) => {
      //mock invalid user input
      let user_invalid_input = {
        "email": "",
        "password": "secret"
      }
      //send /POST request to /register
      chai.request(server).post('/user/signup').send(user_invalid_input).then(res => {
        //validate
        expect(res).to.have.status(401);
        expect(res.body.errors.length).to.be.equal(1);

        //done after all assertions pass
        done();
      }).catch(err => {
        console.log(err);
      });
    });
    
    //when the password is not provided
    it('should return 401 for invalid password input', (done) => {
      //mock invalid user input
      let user_invalid_input = {
        "email": "jado@gmail.com"
      }
      //send /POST request to /register
      chai.request(server).post('/user/signup').send(user_invalid_input).then(res => {
        //validate
        expect(res).to.have.status(401);
        expect(res.body.errors.length).to.be.equal(1);

        //done after all assertions pass
        done();
      }).catch(err => {
        console.log(err);
      });
    });


    it('Should return error 422 when email already registered', (done) => {
        //user that already exists (added in previous test)
        const new_user = {
            "email": "john@gmail.com",
            "password": "secret"
        }
        //send request to the server
        chai.request(server).post('/user/signup')
        .send(new_user)
        .then((res) => {
            //console.log(res.body);
            //assertions
            expect(res).to.have.status(422);
            expect(res.body.message).to.be.equal("Invalid email");
            expect(res.body.errors.length).to.be.equal(1);
            done();
        }).catch(err => {
        console.log(err.message);
        });
    });


  it('Should save password encrypted', (done) => {
    //mock valid user input
    const new_user = {
      "email": "john2@gmail.com",
      "password": "secret"
    }
    //send request to the server
    chai.request(server).post('/user/signup')
      .send(new_user)
        .then((res) => {
          //console.log(res.body);
          //assertions
          
          expect(res.body.password).to.not.be.equal("secret");
          done();
        }).catch(err => {
          console.log(err.message);
        })
  })

  

})

describe('User login', () => {

  it('should return error 422 for empty email', (done) => {
    //mock invalid user input
    const wrong_input = {
      "email": "",
      "password": "password"
    }
    //send request to the server
    chai.request(server).post('/user/login')
      .send(wrong_input)
        .then((res) => {
          //console.log(res.body);
          //assertions
          expect(res).to.have.status(422);
          expect(res.body.message).to.be.equal("Invalid input");
          expect(res.body.errors.length).to.be.equal(1);
          done();
        }).catch(err => {
          console.log(err.message);
        })
  }); 

  it('should return error 422 for empty password', (done) => {
    //mock invalid user input
    const wrong_input = {
      "email": "notvalidmail",
      "password": ""
    }
    //send request to the server
    chai.request(server).post('/user/login')
      .send(wrong_input)
        .then((res) => {
          //console.log(res.body);
          //assertions
          expect(res).to.have.status(422);
          expect(res.body.message).to.be.equal("Invalid input");
          expect(res.body.errors.length).to.be.equal(1);
          done();
        }).catch(err => {
          console.log(err.message);
        })
  }); 

  it('should return error 401 for invalid email', (done) => {
    //mock invalid user input
    const wrong_input = {
      "email": "john12@gmail.com",
      "password": "secret"
    }
    //send request to the server
    chai.request(server).post('/user/login')
      .send(wrong_input)
        .then((res) => {
          //console.log(res.body);
          //assertions
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.equal("Auth error, email not found");
          done();
        }).catch(err => {
          console.log(err.message);
        })
  });


  it('should return error 401 for invalid credentials', (done) => {
    //mock invalid user input
    const wrong_input = {
      "email": "john@gmail.com",
      "password": "invalidPassword"
    }
    //send request to the server
    chai.request(server).post('/user/login')
      .send(wrong_input)
        .then((res) => {
          //console.log(res.body);
          //assertions
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.equal("Auth error");
          done();
        }).catch(err => {
          console.log(err.message);
        })
  }); 

  it('should return 200 and token for valid credentials', (done) => {
    //mock invalid user input
    const valid_input = {
      "email": "john@gmail.com",
      "password": "secret"
    }
    //send request to the server
    chai.request(server).post('/user/login')
      .send(valid_input)
        .then((res) => {
          //assertions
          expect(res).to.have.status(200);
          expect(res.body.token).to.exist;
          expect(res.body.message).to.be.equal("Auth OK");
          expect(res.body.errors.length).to.be.equal(0);
          done();
        }).catch(err => {
          console.log(err.message);
        })
  });
});


/*
		* Test the /DELETE/:id route
		*/
		describe('Delete a user', () => {
			it('it should DELETE a user given the id', (done) => {
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
				let user = new User({
					email: "kabano8@gmail.com",
					password: "lorem"
				})
				user.save((err, user) => {
					  chai.request(server)
					  .delete('/user/' + user.id)
					  .set('Authorization', token)
					  .end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('message').eql('User deleted!');
							res.body.result.should.have.property('ok').eql(1);
							res.body.result.should.have.property('n').eql(1);
						done();
					  });
				});
      });
    });
		});
