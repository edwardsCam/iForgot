(function() {

    var userId = getUserId();

    $(document).ready(function() {

        $('#btnAddTodo').on('click', function() {
            createRow(newRow());
        });
        $('#btnSave').on('click', saveList);
        $('#btnLogout').on('click', logout);

        // get the todo items for the authenticated user.
        //    if authentication fails, redirect to login.
        $.ajax({
            type: 'GET',
            url: '/todo/' + userId,
            headers: headers(),
            success: function(resp) {
                if (resp.success === false) {
                    window.location = '/login';
                } else {
                    populateTable(resp);
                }
            }
        });
    });

    // fill every row
    function populateTable(data) {
        $('#todolist').empty();
        _.sortBy(data, 'done').forEach(createRow);
    }

    // append a new row.
    function createRow(d) {
        $('.todoDelete button').unbind();
        $('#todolist').append(getRowMarkup(d));
        $('.todoDelete button').on('click', deleteRow);
        function getRowMarkup(d) {
            var ret = '<tr>';
            ret += '<td class="todoDone"><input type="checkbox" ' + (d.done ? 'checked disabled' : '') + '></td>';
            ret += '<td class="todoInput"><input class="form-control todoVal" value="' + d.desc + '" ' + (d.done ? 'disabled' : '') + '></td>';
            ret += '<td class="todoDelete"><button class="btn btn-xs btn-danger"><span class="glyphicon glyphicon-remove"></span></button></td>';
            ret += '</tr>';
            return ret;
        }
    }

    // save the local state of the todo items.
    function saveList(event) {
        var data = getClientSideData();
        if (!validate(data)) {
            bootbox.alert('Invalid input!');
            return;
        }
        bootbox.confirm('Are you sure you want to save?', function(resp) {
            if (!resp) return;
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/todo/' + userId,
                headers: headers(),
                success: function(resp) {
                    populateTable(data);
                    bootbox.alert('Save successful!');
                },
                error: function(err) {
                    bootbox.alert('Error saving todo list.');
                }
            });
        });

        // get the content of the table (which may have been mutated since load)
        function getClientSideData() {
            return $('#todolist tr').map(function() {
                var row = $(this),
                    isChecked = row.find('.todoDone input').is(':checked'),
                    text = row.find('.todoInput input').val();
                return newRow(text, isChecked);
            }).toArray();
        }

        // if not marked done, each item must have text.
        function validate(data) {
            return data.every(function(d) {
                return d.done || d.desc;
            });
        }
    }

    function getUserId() {
        var token = window.localStorage.token.split('.'),
            claim = atob(token[1]);
        return JSON.parse(claim).userId;
    }

    function logout() {
        delete window.localStorage.token;
        window.location = '/login';
    }

    function deleteRow() {
        $(this).closest('tr').remove();
    }

    function newRow(text, isChecked) {
        return {
            desc: text || '',
            done: (isChecked === undefined ? false : isChecked)
        };
    }

    function headers() {
        return {
            authorization: 'Bearer ' + window.localStorage.token
        };
    }

})();
