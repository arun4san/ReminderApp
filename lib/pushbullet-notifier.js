/**
 * Created by aruns on 24/12/14.
 */
var moment = require('moment');
var appkey = global.config.pushbullet.api_key;
var domain = global.domain;
var PushBullet = require('pushbullet');
var pusher = new PushBullet(appkey);


var sendPushBulletNotification = function(event,cb){

    try{
        var eventBodyText = 'Reminder Notification : '+event.eventName +'@ '+moment(event.end).format('MM/DD/YYYY HH:mm:ss');
        pusher.note(event.email, event.eventName, eventBodyText, function(error, response) {
            cb(error, response)
        });

    }catch(err){
        console.log("error occurred in sendPushBulletNotification.. ",err);
        cb(null)
    }

}

module.exports ={

    sendPushBullet : sendPushBulletNotification
}