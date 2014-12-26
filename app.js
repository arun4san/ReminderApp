
/**
 * Module dependencies.
 */
global.root = __dirname;
var express = require('express');

var http = require('http');
var path = require('path');
mongoose = require('mongoose');
var moment = require('moment');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var config = global.config = require('./config.js');

mongoose.connect(config.url); // connect to our database

// creating models
var reminderSchema = mongoose.Schema({
    eventName: String,
    isMailCompleted: Boolean,
    isPBCompleted: Boolean,
    email:String,
    end : { type: Date, default: moment().add('hours', 1).toDate()},
    remindMeForMail : { type: Date, default: moment().add('hours', 1).toDate() },
    remindMeForPB : { type: Date, default: moment().add('hours', 1).toDate() }
});

var Reminder = mongoose.model('reminder', reminderSchema);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


   http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
   });


require('./routes/http-route-services')(app,Reminder);

require('./cron.js')(Reminder);