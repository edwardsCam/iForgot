var assert = require('assert');
var request = require('supertest');

describe('Todo list', function() {

    var app = require('../app');
    var User = require('../schemas/User');
    var testUser;

    beforeEach(function() {
        testUser = new User();
        testUser.userName = 'testUser';
        testUser.hashAndSetPassword('testPass');
    });

    it('Does not load the todo list if the user is not logged in', test_todo_notAuthenticated)
    it('Loads the todo list for the logged-in user', test_todo_authenticated);

    function test_todo_notAuthenticated(done) {
        testUser.save(function() {
            var payload = loginPayload('testUser', 'testPass');
            request(app)
                .post('/user/login')
                .send(payload)
                .expect(200)
                .end(afterLogin);
        });
        function afterLogin(err) {
            if (err) return;
            User.find().byName('testUser').exec(foundUser);
        }
        function foundUser(err, resp) {
            var userId = resp._id;
            request(app)
                .get('/todo/' + userId)
                .expect(401)
                .end(finish);
        }
        function finish(err) {
            User.remove(testUserQuery(), function() {
                if (!err) done();
            });
        }
    }

    function test_todo_authenticated(done) {
        var sampleTodoList = [{
            desc: 'a test item',
            done: false
        }];

        testUser.todo = sampleTodoList;
        testUser.save(function() {
            var payload = loginPayload('testUser', 'testPass');
            request(app)
                .post('/user/login')
                .send(payload)
                .expect(200)
                .end(afterLogin);
        });

        function afterLogin(err, res) {
            if (!res.body.success) return;
            var token = res.body.msg;
            User.find().byName('testUser').exec(function(err, resp) {
                var userId = resp._id;
                request(app)
                    .get('/todo/' + userId)
                    .set({ authorization: 'Bearer ' + token })
                    .expect(200)
                    .end(afterGotUserData);
            });
        }
        function afterGotUserData(err, res) {
            User.remove(testUserQuery(), function() {
                if (err) return;
                if (res.body.length !== 1) return;
                if (res.body[0].desc !== sampleTodoList[0].desc) return;
                if (res.body[0].done !== sampleTodoList[0].done) return;
                done();
            });
        }
    }

    function loginPayload(u, p) {
        return { userName:u, pass:p };
    }

    function testUserQuery() {
        return { userName:'testUser' };
    }

});
