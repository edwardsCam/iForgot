(function() {

    $(document).ready(function() {

        var inpUser = $('#inpCreateUsername'),
            inpPass = $('#inpCreatePassword');

        $('#btnCreateAct').on('click', pressRegister);

        function pressRegister(e) {
            e.preventDefault();
            var userName = inpUser.val(),
                pass = inpPass.val();

            /* validation */ {
                if (!userName) {
                    bootbox.alert('Please enter a username.');
                    return;
                }
                if (userName.length < 3) {
                    bootbox.alert('Please use at least a 3-character username.');
                    return;
                }
                if (!pass) {
                    bootbox.alert('Please enter a password.');
                    return;
                }
                if (pass.length < 5) {
                    bootbox.alert('Please use at least a 5-character password.');
                    return;
                }
            }

            var data = {
                user: userName,
                pass: pass
            };
            $.ajax({
                type: 'POST',
                url: '/user/register',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(resp) {
                    bootbox.alert('Register successful!', function() {
                        window.location = '/login';
                    });
                },
                error: function(err) {
                    if (err.status === 409) {
                        bootbox.alert(err.responseText);
                    } else console.error(err);
                }
            });

        }

    });

})();
