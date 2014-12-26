
var EM = require('./lib/email-dispatcher.js');
var async = require('async');
var pushbullet = require('./lib/pushbullet-notifier.js');

module.exports = function (Reminder) {

	function checkReminders () {
        try{

            async.parallel({

                emailNotification : function(cb){

                    Reminder.find({ 'remindMeForMail': { $lte: Date.now() } }, function (err, reminders) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        async.forEach(reminders, function (event, callback){

                            if (!event.isMailCompleted) {
                                    console.log("mail.........",event.email);
                                    EM.sendAlert(event,event.email,callback)
                                    event.isMailCompleted = true
                                    event.save();
                                cb();
                            }
                        }, function(err) {
                            //console.log("Event emailNotification completed..")
                        });
                    });



                },
                pBNotification : function(cb){

                    Reminder.find({ 'remindMeForPB': { $lte: Date.now() } }, function (err, reminders) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        async.forEach(reminders, function (event, callback){

                            if (!event.isPBCompleted) {

                                pushbullet.sendPushBullet(event,callback)
                                event.isPBCompleted = true
                                event.save();
                                cb();

                            }
                        }, function(err) {
                            //console.log("Event pBNotification completed..")
                        });
                    });

                },
                startOfTaskPBNotification : function(cb){

                    Reminder.find({ 'end': { $lte: Date.now() } }, function (err, reminders) {

                        if (err) {
                            console.log(err);
                            return;
                        }
                        async.forEach(reminders, function (event, callback){

                            if (!event.isEventStarted) {

                                pushbullet.sendPushBullet(event,callback)
                                event.isEventStarted = true;
                                event.save();
                                cb();

                            }
                        }, function(err) {
                            //console.log("Event pBNotification completed..")
                        });
                    });

                }

            },function(err,res){

            });


        }catch (err){
            console.log("error occurred in checking reminder function.. ",err);
        }

	}

	setInterval(checkReminders, 6000);
	checkReminders();
};