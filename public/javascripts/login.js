(function() {

    $(document).ready(function() {

        delete window.localStorage.token;

        var inpUser = $('#inpLoginUsername'),
            inpPass = $('#inpLoginPassword');

        $('#btnLogin').on('click', pressLogin);

        function pressLogin(e) {
            e.preventDefault();
            var userName = inpUser.val(),
                pass = inpPass.val();

            /* validation */ {
                if (!userName) {
                    bootbox.alert('Please enter your username.');
                    return;
                }
                if (!pass) {
                    bootbox.alert('Please enter your password.');
                    return;
                }
            }

            $.ajax({
                type: 'POST',
                url: '/user/login',
                data: JSON.stringify({
                    user: userName,
                    pass: pass
                }),
                contentType: 'application/json',
                success: function(resp) {
                    if (resp.success) {
                        window.localStorage.token = resp.token;
                        $.ajax({
                            type: 'POST',
                            url: '/main',
                            data: JSON.stringify({ token:window.localStorage.token }),
                            contentType: 'application/json',
                            success: function(msg) { window.location = '/main'; }
                        });
                    } else if (resp.msg) {
                        bootbox.alert(resp.msg);
                    }
                }
            });
        }

    });



})();
