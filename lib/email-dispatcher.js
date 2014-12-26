
var ES = global.config.mail;
var moment = require('moment');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
	ssl		    : true

});

EM.sendAlert = function(msg,email, callback)
{

        EM.server.send({
            from         : ES.sender,
            to           : email,
            subject      : 'Reminder Notification : '+msg.eventName +'@ '+moment(msg.end).format('MM/DD/YYYY HH:mm:ss'),
            text         : 'Reminder ',
            attachment   : EM.composeEmail(msg)
        }, callback );

}

EM.composeEmail = function(event)
{
	var html = "<html><body>";

        html += "<b>Event Name  : "+event.eventName+" </b><br><br>";
        html += "When : "+moment(event.end).format('MM/DD/YYYY HH:mm:ss')+" <br><br>";
        html += "Event Creator : "+event.email+" <br><br>";
        html += "Thanks.<br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}



