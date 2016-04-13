var $ = require('jquery');

module.exports = {
    get: function(url, callback, fallback) {
        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'GET',
            success: callback,
            error: fallback
        });
    },
    post: function(url, todos, callback, fallback) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: { todos: todos },
            success: callback,
            error: fallback
        });
    }
};
