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
                    alert('Please enter a username.');
                    return;
                }
                if (userName.length < 3) {
                    alert('Please use at least a 3-character username.');
                    return;
                }
                if (!pass) {
                    alert('Please enter a password.');
                    return;
                }
                if (pass.length < 5) {
                    alert('Please use at least a 5-character password.');
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
                    window.location = '/login';
                },
                error: function(err) {
                    if (err.status === 409) {
                        alert(err.responseText);
                    } else console.error(err);
                }
            });

        }

    });

})();
