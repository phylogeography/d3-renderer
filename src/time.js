/**
 * @fbielejec
 */

//---MODULE IMPORTS---//

var d3 = require('d3');
require("script!./d3.slider.js");
require("./d3.slider.css");
var utils = require('./utils');
var global = require('./global');


//---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateTime = function(timeline) {

	dateFormat = d3.time.format("%Y/%m/%d");

	var startDate = utils.formDate(timeline.startTime);
	sliderStartValue = startDate.getTime();

	var endDate = utils.formDate(timeline.endTime);
	sliderEndValue = endDate.getTime();

	currentSliderValue = sliderStartValue;

	var sliderSpeed = 100;
	var duration = sliderEndValue - sliderStartValue;
	sliderInterval = duration / sliderSpeed;

	// initial value
	currentDateDisplay = d3.select('#currentDate').text(dateFormat(startDate));

	timeScale = d3.time.scale.utc().domain([ startDate, endDate ]).range(
			[ 0, 1 ]);

	timeSlider = d3.slider().scale(timeScale).axis(d3.svg.axis());
	d3.select('#timeSlider').call(timeSlider);

}// END: generateTime

exports.initializeTimeSlider = function(timeSlider, timeScale, currentDateDisplay,
		dateFormat) {

	// time slider listener
	timeSlider.on('slide', function(evt, value) {

		// TODO
//		update(value, timeScale, currentDateDisplay, dateFormat);
		currentSliderValue = value;

	});// END: slide

	var playPauseButton = d3.select('#playPause').attr("class", "playPause")
			.on(
					"click",
					function() {

						if (playing) {
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
								update(sliderValue, timeScale,
										currentDateDisplay, dateFormat);

								currentSliderValue = sliderValue;

							}, 100);

						}// END: playing check

					});

}// END: initializeTimeSlider