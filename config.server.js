var connection_string = '127.0.0.1:27017/shopylytics';
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
if(process.env=='production')
	connection_string ='mongodb://admin:qwerty@ds015902.mlab.com:15902/shopylytics'
var url = 'mongodb://' + connection_string;

module.exports = {
	db:{
		url:url
	},
	session_secret:'swagmeradesihai'
}