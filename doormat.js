/* -----------------------------

TEXTING DOORMAT
Justin Smith - justin@isamaker.com
@justinIsAMaker

Listen for a pressure sensor to register over a certain number, then text me via Twilio
------------------------------ */

// Require Node libraries
var mraa = require('mraa');
var request = require('request');

// TWILIO
var twilio = require('twilio');
var client = new twilio.RestClient(
	'[ INSERT TWILIO PUBLIC KEY ]',
	'[ INSERT TWILIO PRIVATE KEY ]'
);

// Declare the sensor
var pressureSensor = new mraa.Aio(0);

// Declare the buzzer
var buzzer = new mraa.Gpio(6);
buzzer.dir(mraa.DIR_OUT);

// Log the MRAA Version as a sanity check
console.log('MRAA Version: ' + mraa.getVersion());

// Set up the init
function init(){
	checkForGuest();
}

function checkForGuest(){
	// Read the pressure sensor
	var guestPresent = pressureSensor.read();

	// DEBUG SENSOR VALUE - UNCOMMENT THIS IF YOU NEED TO
	// FIGURE OUT YOUR SENSOR RANGE
	// console.log(guestPresent);

	// Check if the value is higher than the threshold to trigger an input
	if(guestPresent >= 400){
		// Sound the buzzer
		buzzer.write(1);
		// Log the level that triggered an action
		console.log('PRESENT: ' + guestPresent);

		// Send the text message
		client.sms.messages.create({
			to:'[ INSERT TARGET PHONE NUMBER ]',
			from:'+1[ INSERT TWILIO PHONE NUMBER ]',
			body: 'Head\'s up, someone is outside'
		}, function(error, message){
			if(!error){
				console.log(message);
			} else {
				console.log(error);
			}
		});

		// Turn the buzzer off
		buzzer.write(0);

		// Wait for 10 seconds, then start listening again
		setTimeout(function(){
			setTimeout(checkForGuest, 100);
		}, 10000);
	} else {
	setTimeout(checkForGuest, 100);
	}
} // END CHECK BUTTON PRESSED

// Init the code
init();
