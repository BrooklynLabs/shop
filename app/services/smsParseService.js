var SmsAndroid = require('react-native-android-sms');
var httpService = require('./httpService.js');
var filter = {
    box: 'inbox'
}
module.exports.inbox = function() {
    SmsAndroid.list(JSON.stringify(filter), (fail) => {
            console.log("OH Snap: " + fail)
        },
        (count, smsList) => {

            console.log('Count: ', count);
            // console.log('List: ', smsList);
            var arr = JSON.parse(smsList);
            
            httpService.get('http://shopylytics-c0dezer0.rhcloud.com/api/v1/user/view');
            httpService.post('http://shopylytics-c0dezer0.rhcloud.com/api/v1/sms/parse', arr, (response) =>{
                console.log(response);
            })			
        });
}
