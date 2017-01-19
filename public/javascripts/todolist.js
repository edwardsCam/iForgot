(function() {

    var userId = 'testUser'; // temporary, for testing

    $(document).ready(function() {

        $('#btnAddTodo').on('click', addItem);
        $('#btnSave').on('click', saveList);

        getTodoList().then(function(resp) {
            resp.forEach(function(d) {
                createRow(d, false);
            });
            registerEditButtons();
        });

        function getTodoList() {
            return $.get('/todo/' + userId).promise();
        }
    });

    function registerEditButtons() {
        $('.todoEdit').unbind();
        $('.todoEdit').on('click', function(e) {
            var row = $(this).closest('tr');
            var rowidx = row.index();

            var inp = row.children('td').children('input');
            inp.removeAttr('disabled');
        });
    }

    function createRow(d, isEnabled) {
        var html = getRowMarkup(d);
        $('#todolist').append(html);

        function getRowMarkup(d) {
            var ret = '<tr>';
            ret += '<td class="todoInput"><input ' + (isEnabled ? '' : 'disabled') + ' value="' + d.desc + '"></td>';
            ret += '<td class="todoEdit"><button><span class="glyphicon glyphicon-edit"></span></button></td>';
            ret += '</tr>';
            return ret;
        }
    }

    function addItem() {
        createRow(newRow(), true);
        registerEditButtons();
    }

    function saveList(event) {
        var data = getClientSideData();
        if (!validate(data)) {
            alert('Invalid input!');
            return;
        }
        if (confirm('Are you sure you want to save?')) {
            $.ajax({
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/todo/' + userId,
                success: function(resp) {
                    alert('Saved!');
                    console.log(resp);
                }
            });
        }

        function getClientSideData() {
            return $('#todolist tr input').map(function() {
                return newRow($(this).val());
            }).toArray();
        }

        function validate(data) {
            return data.every(function(d) {
                return d.desc;
            });
        }
    }

    function newRow(text) {
        return {
            desc: text || ''
        };
    }

})();
