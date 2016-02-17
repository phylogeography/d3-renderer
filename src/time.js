/**
 * @fbielejec
 */

//---MODULE IMPORTS---//

var d3 = require('d3');
var utils = require('./utils');
require("script!./d3.slider.js");
require("./d3.slider.css");

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

