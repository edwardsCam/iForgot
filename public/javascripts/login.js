if (!module) var module = {};
module.exports = (function() {

    $(document).ready(function() {

        delete window.localStorage.token;

        var inpUser = $('#inpLoginUsername'),
            inpPass = $('#inpLoginPassword');

        $('#btnLogin').on('click', pressLogin);

        function pressLogin(e) {
            e.preventDefault();
            var data = {
                userName: inpUser.val(),
                pass: inpPass.val()
            };
            if (validateInput(data)) {
                postToLogin(data);
            }
        }
    });

    return {
        validateInput: validateInput
    };

    function validateInput(data, ignoreLog) {
        if (!data.userName) {
            if (!ignoreLog) bootbox.alert('Please enter your username.');
            return false;
        }
        if (!data.pass) {
            if (!ignoreLog) bootbox.alert('Please enter your password.');
            return false;
        }
        return true;
    }

    // passed input validation, so request a login on the server.
    //   if user/pass combo does not match, nothing will happen.
    //   if user/pass combo is valid, the server will generate and return a token.
    function postToLogin(payload) {
        $.ajax({
            type: 'POST',
            url: '/user/login',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: successFunc
        });

        function successFunc(resp) {
            if (resp.success) {
                window.localStorage.token = resp.msg;
                postToMain();
            } else if (resp.msg) {
                bootbox.alert(resp.msg);
            }
        }
    }

    // redirect to the main screen, with authentication
    function postToMain() {
        $.ajax({
            type: 'POST',
            url: '/main',
            headers: headers(),
            success: function() {
                window.location = '/main';
            }
        });
    }

    function headers() {
        return {
            authorization: 'Bearer ' + window.localStorage.token
        };
    }

})();
