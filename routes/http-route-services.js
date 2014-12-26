/**
 * Created by aruns on 26/12/14.
 */

var moment = require('moment');
var async = require('async');


module.exports = function (app , Reminder) {

    app.get('/', function (req, res) {

        try{
            Reminder.find({}, function ( err, eventList ){
                res.render( 'index', {
                    title : 'Reminder App',
                    eventList : eventList
                });
            });

        }catch(err){
            console.log("error occurred in listing all reminders function.. ",err)
        }

    });

    app.post('/reminders', function (req, res) {

        var reminder = new Reminder();

        try{
            async.parallel({

                eventName : function(cb){ setPassedArguments(req.body.eventName, cb) },
                end : function(cb){ setPassedArguments(new Date(req.body.end), cb) },
                email : function(cb){ setPassedArguments(req.body.email, cb) },
                remindMeForMail : function(cb){ setPassedArguments(new Date(moment(new Date(req.body.end)).subtract(parseInt(req.body.remindMeForMail), 'minute')), cb) },
                remindMeForPB : function(cb){ setPassedArguments(new Date(moment(new Date(req.body.end)).subtract(5, 'minute')), cb) }

            },function(err, requestObject){
                reminder.set(requestObject);
                reminder.save();
                res.send(reminder);
            })
        }catch(err){
            console.log("error occurred in adding reminders function.. ",err)
        }

    });


    app.get('/destroy/:id', function (req, res) {

        try{

        }catch(err){
            console.log("error occurred in destroy function.. ",err)
        }
        Reminder.findByIdAndRemove(req.params.id, function (err) {
            if (err){
                console.log('Error deleting', err);
            } else{
                res.redirect('/');
            }
        });
    });

};

var setPassedArguments = function(_object, cb){
        cb(null, _object);
};