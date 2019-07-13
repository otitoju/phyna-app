// Import the dependencies for testing 
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const mongoose = require('mongoose')
const User = require('../models/user')
// Configure chai
chai.use(chaiHttp);
chai.should();

//https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
describe("Users route test", () => {
    before(function() {
        mongoose.createConnection('mongodb://localhost:27017/PHYNARECIPE');
      });
    
    //   beforeEach(function(done) {
    //     // I do stuff like populating db
    //   });
    
    //   afterEach(function(done) {
    //     // I do stuff like deleting populated db
    //   });
    
      after(function() {
        mongoose.connection.close();
      });
    
    describe("GET /", () => {
        // Test to get all students record
        it("should get all users", (done) => {
             chai.request(app)
                 .get('/users')
                 .end((err, success) => {
                     success.should.have.status(200);
                     success.body.should.be.a('object');
                     console.log(success)
                     //res.json(success)
                     done();
                  });
         });

    });
    /*
  * Test the /POST route
  */
  
    describe('/POST user', () => {
        it('it should not POST user without all field', (done) => {
            let user = {
                
                email:'magma',
                password:'moten'
            }
          chai.request(app)
              .post('/register')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(206);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.have.property('email');
                    res.body.message.email.should.have.property('message').eql('Error pls fill all fields');
                done();
              });
        });
        // all field present
        it('it should POST user with all field', (done) => {
            let user = {
                name:"johnson",
                email:'johnson@gmail.com',
                password:'john'
            }
          chai.request(app)
              .post('/register')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('successful');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('name');
                    res.body.user.should.have.property('password');
                    
                done();
              });
        });
      })

    /*
  * Test the /GET/:id route
  */
  describe('/GET/:id user', () => {
    it('it should GET a user by the given id', (done) => {
        let user = new User({ name:'Amos', email: 'Amos@gmail.com', password:'12345' });
        user.save((err, user) => {
            chai.request(app)
          .get('/user/' + user.id)
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
                res.body.should.have.property('_id').eql(user.id);
            done();
          });
        });

    });
    });

    /*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id book', () => {
    it('it should UPDATE a user given the id', (done) => {
      let user = new User({ name:'Amos', email: 'Amos@gmail.com', password:'12345' });
        user.save((err, user) => {
              chai.request(app)
              .put('/user/put/' + user.id)
              .send({name:'Amos', email: 'Amos@gmail.com', password:'12345678'})
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('user updated!');
                    res.body.book.should.have.property('password').eql('12345678');
                done();
              });
        });
    });
    });

    /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id book', () => {
    it('it should DELETE a user given the id', (done) => {
      let user = new User({ name:'Amos', email: 'Amos@gmail.com', password:'12345' });
        user.save((err, user) => {
              chai.request(app)
              .delete('/delete/' + user.id)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('user successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                done();
              });
        });
    });
    });
});