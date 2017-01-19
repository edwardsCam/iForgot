(function() {

    $(document).ready(function() {

        var inpUser = $('#inpLoginUsername'),
            inpPass = $('#inpLoginPassword');

        $('#btnLogin').on('click', pressLogin);

        function pressLogin(event) {
            var userName = inpUser.val(),
                pass = inpPass.val();

            if (!userName) {
                alert('Please enter your username.');
                return;
            }
            if (!pass) {
                alert('Please enter your password.');
                return;
            }

            $.ajax({
                type: 'GET',
                url: '/user/profile/' + userName,
                success: checkIfUserExists,
                error: loginError
            });

            function checkIfUserExists(data) {
                if (data) {
                    checkIfPasswordIsCorrect(data);
                } else {
                    alert('There is no user with that username.');
                }
            }

            function checkIfPasswordIsCorrect(data) {
                if (data.passHash === pass) {
                    alert('good');
                    window.location = '/main';
                } else {
                    alert('Invalid password');
                }
            }

            function loginError(msg) {
                alert('Error logging in.');
                console.error(msg);
            }
        }

    });



})();
