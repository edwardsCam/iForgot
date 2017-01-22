var assert = require('assert');
var request = require('supertest');

describe('Login', function() {

    describe('Input validation', test_inputValidation);
    describe('Login logic', test_loginLogic);

    function test_inputValidation() {

        var registration,
            benv = require('benv');

        beforeEach(function(done) {
            benv.setup(function() {
                benv.expose({ $:mockJquery });
                login = require('../public/javascripts/login.js');
                done();
            });
            function mockJquery() {
                return { ready: function() {} };
            }
        });

        it('Checks for empty username before attempting login', test_inputValidation_userName);
        it('Checks for empty password before attempting login', test_inputValidation_password);

        function test_inputValidation_userName() {
            assert.equal(
                false,
                login.validateInput(loginPayload('', 'doesntMatter'), true)
            );
            assert.equal(
                true,
                login.validateInput(loginPayload('valid', 'doesntMatter'), true)
            );
        }

        function test_inputValidation_password() {
            assert.equal(
                false,
                login.validateInput(loginPayload('doesntMatter', ''), true)
            );
            assert.equal(
                true,
                login.validateInput(loginPayload('doesntMatter', 'valid'), true)
            );
        }
    }

    function test_loginLogic() {

        var app = require('../app');
        var User = require('../schemas/User');
        var testUser;

        beforeEach(function() {
            testUser = new User();
            testUser.userName = 'testUser';
            testUser.hashAndSetPassword('testPass');
        });

        it('Logs in when given valid credentials', test_loginLogic_valid);
        it('Does not log in when given invalid credentials', test_loginLogic_invalid);
        it('Does not log in if the user does not exist', test_loginLogic_noUser);

        function test_loginLogic_valid(done) {
            testUser.save(function() {
                var payload = loginPayload('testUser', 'testPass');
                request(app)
                    .post('/user/login')
                    .send(payload)
                    .expect(200)
                    .end(finish);
            });
            function finish(err) {
                User.remove(testUserQuery(), function() {
                    if (!err) done();
                });
            }
        }

        function test_loginLogic_invalid(done) {
            testUser.save(function() {
                var payload = loginPayload('testUser', 'wrongPassword');
                request(app)
                    .post('/user/login')
                    .send(payload)
                    .expect(200)
                    .end(finish);
            });
            function finish(err, res) {
                User.remove(testUserQuery(), function() {
                    if (!res.body.success && res.body.msg === 'Bad login') done();
                });
            }
        }

        function test_loginLogic_noUser(done) {
            User.remove(testUserQuery(), function() {
                var payload = loginPayload('testUser', 'doesntMatter');
                request(app)
                    .post('/user/login')
                    .send(payload)
                    .expect(200)
                    .end(finish);
            });
            function finish(err, res) {
                if (!res.body.success && res.body.msg === 'Bad login') done();
            }
        }

        function testUserQuery() {
            return { userName:'testUser' };
        }
    }

    function loginPayload(u, p) {
        return { userName:u, pass:p };
    }
});
