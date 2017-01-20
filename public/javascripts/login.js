(function() {

    $(document).ready(function() {

        delete window.localStorage['token'];

        var inpUser = $('#inpLoginUsername'),
            inpPass = $('#inpLoginPassword');

        $('#btnLogin').on('click', pressLogin);

        function pressLogin(e) {
            e.preventDefault();
            var userName = inpUser.val(),
                pass = inpPass.val();

            /* validation */ {
                if (!userName) {
                    alert('Please enter your username.');
                    return;
                }
                if (!pass) {
                    alert('Please enter your password.');
                    return;
                }
            }

            var data = {
                user: userName,
                pass: pass
            };
            $.ajax({
                type: 'POST',
                url: '/user/login',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(msg) {
                    alert('success!');
                    window.localStorage['token'] = msg.token;
                    window.localStorage['userId'] = msg.userId;

                    $.ajax({
                        type: 'POST',
                        url: '/main',
                        data: JSON.stringify({
                            token: window.localStorage['token']
                        }),
                        contentType: 'application/json',
                        success: function(msg) {
                            window.location = '/main';
                        },
                        error: loginError
                    });
                },
                error: loginError
            });

            function loginError(msg) {
                alert('Bad login.');
                console.error(msg);
            }
        }

    });



})();
