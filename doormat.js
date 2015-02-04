/* -----------------------------

TEXTING DOORMAT
Justin Smith - justin@isamaker.com
@justinIsAMaker

Listen for a pressure sensor to register over a certain number, then text me via Twilio
------------------------------ */

// Require Node libraries
var mraa = require('mraa');
var request = require('request');

//TWILIO
var twilio = require('twilio');
var client = new twilio.RestClient(
	'[ INSERT TWILIO PUBLIC KEY ]',
	'[ INSERT TWILIO PRIVATE KEY ]'
);

// Declare the sensor
var pressureSensor = new mraa.Aio(0);

// Declare the buzzer
var buzzer = new mraa.Gpio(2);
buzzer.dir(mraa.DIR_OUT);

console.log('MRAA Version: ' + mraa.getVersion());

function init(){
	checkForGuest();
}

function checkForGuest(){
	var guestPresent = pressureSensor.read();

	if(guestPresent){
		buzzer.write(1);

		client.sms.messages.create({
			to:'[ INSERT TARGET PHONE NUMBER ]',
			from:'+[INSERT TWILIO PHONE NUMBER]',
			body: 'Your guest has arrived!'
		}, function(error, message){
			if(!error){
				console.log(message);
			} else {
				console.log(error);
			}
		});
		setTimeout(function(){
			setTimeout(checkForGuest, 100);
		}, 2000);
	} else {
	setTimeout(checkForGuest, 100);
	}
} // END CHECK BUTTON PRESSED

init();