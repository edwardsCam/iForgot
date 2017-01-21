(function() {

    var userId = window.localStorage['userId'];

    $(document).ready(function() {

        $('#btnAddTodo').on('click', function() {
            createRow(newRow());
        });
        $('#btnSave').on('click', saveList);

        $.ajax({
            type: 'GET',
            url: '/todo/' + userId,
            headers: headers(),
            success: populateTable
        });
    });

    function populateTable(data) {
        $('#todolist').empty();
        _.sortBy(data, 'done').forEach(createRow);
    }

    function createRow(d) {
        $('#todolist').append(getRowMarkup(d));
        function getRowMarkup(d) {
            var ret = '<tr>';
            ret += '<td class="todoDone"><input type="checkbox" ' + (d.done ? 'checked disabled' : '') + '></td>';
            ret += '<td class="todoInput"><input class="form-control todoVal" value="' + d.desc + '" ' + (d.done ? 'disabled' : '') + '></td>';
            ret += '</tr>';
            return ret;
        }
    }

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
                    bootbox.alert('Error getting todo list.');
                }
            });
        });

        function getClientSideData() {
            return $('#todolist tr').map(function() {
                var row = $(this),
                    isChecked = row.find('.todoDone input').is(':checked'),
                    text = row.find('.todoInput input').val();
                return newRow(text, isChecked);
            }).toArray();
        }

        function validate(data) {
            return data.every(function(d) {
                return d.done ? d.desc : true;
            });
        }
    }

    function newRow(text, isChecked) {
        return {
            desc: text || '',
            done: (isChecked === undefined ? false : isChecked)
        };
    }

    function headers() {
        return {
            authorization: window.localStorage['token']
        };
    }

})();
