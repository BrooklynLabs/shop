module.exports = {
    get: function(url, callback, fallback) {
        fetch(url)
            .then((response)=> response.text())
            .then((responseText)=>{
                console.log(responseText);
            })
    },
    post: function(url, data, callback, fallback) {
        fetch(url, { method: 'POST', body: JSON.stringify(data) })
            .then((response) => response.text())
            .then((responseText) => {
                console.log(responseText);
                callback(responseText);
            })
            .catch((error) => {
                console.warn(error);
            });
    }
};
