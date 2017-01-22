describe('Register', function() {

    var assert = require('assert');
    describe('Input validation', test_inputValidation);
    describe('Registration logic', test_registrationLogic);

    function test_inputValidation() {

        var registration,
            benv = require('benv');

        beforeEach(function(done) {
            benv.setup(function() {
                benv.expose({ $:mockJquery });
                registration = require('../public/javascripts/register.js');
                done();
            });
            function mockJquery() {
                return { ready: function() {} };
            }
        });

        it('Checks for empty username before attempting register', test_inputValidation_emptyUser);
        it('Checks for username shorter than 3-char before attempting register', test_inputValidation_shortUser);
        it('Checks for empty password before attempting register', test_inputValidation_emptyPass);
        it('Checks for password shorter than 5-char before attempting register', test_inputValidation_shortPass);

        function test_inputValidation_emptyUser() {
            assert.equal(
                false,
                registration.validateInput(registrationPayload('', 'doesntMatter'), true)
            );
        }

        function test_inputValidation_shortUser() {
            assert.equal(
                false,
                registration.validateInput(registrationPayload('12', 'doesntMatter'), true)
            );
            assert.equal(
                true,
                registration.validateInput(registrationPayload('123', 'doesntMatter'), true)
            );
        }

        function test_inputValidation_emptyPass() {
            assert.equal(
                false,
                registration.validateInput(registrationPayload('doesntMatter', ''), true)
            );
        }

        function test_inputValidation_shortPass() {
            assert.equal(
                false,
                registration.validateInput(registrationPayload('doesntMatter', '1234'), true)
            );
            assert.equal(
                true,
                registration.validateInput(registrationPayload('doesntMatter', '12345'), true)
            );
        }
    }

    function test_registrationLogic() {

        var testUser,
            request = require('supertest'),
            app = require('../app'),
            User = require('../schemas/User');

        beforeEach(function() {
            testUser = new User();
            testUser.userName = 'testUser';
            testUser.hashAndSetPassword('testPass');
        });

        it('Registers if the username does not already exist', test_registrationLogic_createNew);
        it('Does not register if the username already exists', test_registrationLogic_alreadyExists);

        function test_registrationLogic_createNew(done) {
            User.remove(testUserQuery(), function() {
                var payload = registrationPayload('testUser', 'testPass');
                request(app)
                    .post('/user/register')
                    .send(payload)
                    .expect(200)
                    .end(finish);
            });
            function finish(err, res) {
                User.remove(testUserQuery(), function() {
                    if (res.body.success) done();
                });
            }
        }

        function test_registrationLogic_alreadyExists(done) {
            testUser.save(function() {
                var payload = registrationPayload('testUser', 'testPass');
                request(app)
                    .post('/user/register')
                    .send(payload)
                    .expect(200)
                    .end(finish);
            });
            function finish(err, res) {
                User.remove(testUserQuery(), function() {
                    if (!res.body.sucess && res.body.msg === 'A user with that username already exists.') done();
                });
            }
        }

        function testUserQuery() {
            return { userName:'testUser' };
        }
    }

    function registrationPayload(u, p) {
        return { userName:u, pass:p };
    }
});
