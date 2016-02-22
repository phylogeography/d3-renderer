/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("./time.css");
var d3 = require('d3');
// TODO: require form node_modules
require("script!./d3.slider.js");
require("./d3.slider.css");
var utils = require('./utils.js');
// var global = require('./global');
var points = require('./points.js');
var lines = require('./lines.js');


// ---MODULE VARIABLES---//

var sliderSpeed = 100;
var playing = false;

var dateFormat;
var timeSlider;
var sliderStartValue;
var sliderEndValue;
var currentSliderValue;
var sliderInterval;
var currentDateDisplay;
var timeScale;
var processID;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

//exports.createHtml = function( document,  all) {
//	
//	var controls = document.createElement('DIV');
//	controls.setAttribute('id', "controls");
//
//	var h2 = document.createElement("H2");
//	var text = document.createTextNode("Current date:");
//	h2.appendChild(text);
//
//	var span = document.createElement('SPAN');
//	span.setAttribute('id', "currentDate");
//	h2.appendChild(span);
//
//	controls.appendChild(h2);
//	
//	var wrapper = document.createElement('DIV');
//
//	var playPause = document.createElement('DIV');
//	playPause.setAttribute('id', "playPause");
//	wrapper.appendChild(playPause);
//
//	var timeSliderDiv = document.createElement('DIV');
//	timeSliderDiv.setAttribute('id', "timeSlider");
//	wrapper.appendChild(timeSliderDiv);
//
//	controls.appendChild(wrapper);
//
////	document.body
//	all.appendChild(controls);
//	
//}//END:createHtml

exports.initializeTimeSlider = function( timeLine) {

	// initialize module variables
	initializeVariables(timeLine);
	
	// put slider at the end of timeLine, everything painted
	timeSlider.value( sliderEndValue);
	updateDateDisplay(sliderEndValue);
	
	// time slider listener
	timeSlider.on('slide', function(evt, value) {

		update(value);
		currentSliderValue = value;

	});// END: slide

	var playPauseButton = d3.select('#playPause').attr("class", "playPause")
			.on(
					"click",
					function() {

						if ( playing) {
							playing = false;
							playPauseButton.classed("playing", playing);

							clearInterval(processID);

						} else {
							playing = true;
							playPauseButton.classed("playing", playing);

							processID = setInterval(function() {

								var sliderValue = currentSliderValue
										+ sliderInterval;
								if (sliderValue > sliderEndValue) {
									sliderValue = sliderStartValue;
								}

								timeSlider.value(sliderValue);
								update(sliderValue);

								currentSliderValue = sliderValue;

							}, 100);

						}// END: playing check

					});

}// END: initializeTimeSlider

// ---FUNCTIONS---//

initializeVariables = function(timeLine) {

	dateFormat = d3.time.format("%Y/%m/%d");

	var startDate = utils.formDate(timeLine.startTime);
	sliderStartValue = startDate.getTime();

	var endDate = utils.formDate(timeLine.endTime);
	sliderEndValue = endDate.getTime();

	currentSliderValue =  sliderStartValue;

	var duration =  sliderEndValue -  sliderStartValue;
	sliderInterval = duration / sliderSpeed;

	// initial value
	currentDateDisplay = d3.select('#currentDate');//.text(dateFormat(startDate));

	 timeScale = d3.time.scale.utc().domain([ startDate, endDate ]).range(
			[ 0, 1 ]);

	timeSlider = d3.slider().scale(timeScale).axis(d3.svg.axis());
	d3.select('#timeSlider').call(timeSlider);

}// END: generateTime

function updateDateDisplay(value) {
		
	var currentDate = timeScale.invert(timeScale(value));
	currentDateDisplay.text(dateFormat(currentDate));

}// END: updateDateDisplay

function update(value) {
		
	updateDateDisplay(value);

    //---POINTS---//
	
	points.updatePointsLayer(value);
	
	// ---LINES---//
	lines.updateLinesLayer(value);
	
}// END: update
