if (!module) var module = {};
module.exports = (function() {

    $(document).ready(function() {
        var inpUser = $('#inpCreateUsername'),
            inpPass = $('#inpCreatePassword');
        $('#btnCreateAct').on('click', function(e) {
            e.preventDefault();
            var data = {
                userName: inpUser.val(),
                pass: inpPass.val()
            };
            if (validateInput(data)) {
                postToRegister(data);
            }
        });
    });

    return {
        validateInput: validateInput
    };

    // passed input validation, so attempt to register on the server.
    //   if the user/pass combo is valid (i.e. not already taken), the server will create the user.
    function postToRegister(payload) {
        $.ajax({
            type: 'POST',
            url: '/user/register',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            success: successFunc
        });

        function successFunc(resp) {
            if (resp.success) {
                bootbox.alert('Registration successful!', function() {
                    window.location = '/login';
                });
            } else if (resp.msg) {
                bootbox.alert(resp.msg);
            }
        }
    }

    function validateInput(data, ignoreLog) {
        if (!data.userName) {
            if (!ignoreLog) bootbox.alert('Please enter a username.');
            return false;
        }
        if (data.userName.length < 3) {
            if (!ignoreLog) bootbox.alert('Please use at least a 3-character username.');
            return false;
        }
        if (!data.pass) {
            if (!ignoreLog) bootbox.alert('Please enter a password.');
            return false;
        }
        if (data.pass.length < 5) {
            if (!ignoreLog) bootbox.alert('Please use at least a 5-character password.');
            return false;
        }
        return true;
    };

})();
