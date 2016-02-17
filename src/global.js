
var exports = module.exports = {};

var lineAttributes;
//exports.lineAttributes = lineAttributes;

var pointAttributes;


var margin = {
	top : 30,
	right : 50,
	bottom : 50,
	left : 200,
};
exports.margin = margin;

var width = 1100 - margin.left - margin.right;
exports.width=width;
var height = 1100 - margin.top - margin.bottom;
exports.height = height;

var minScaleExtent = 1;
exports.minScaleExtent=minScaleExtent;
var maxScaleExtent = 5;
exports.maxScaleExtent = maxScaleExtent;
var lineWidth = 2;

// time slider
var playing = false;
var processID;
var currentSliderValue;
var sliderInterval;
var sliderStartValue;
var sliderEndValue;

var timeSlider;
exports.timeSlider = timeSlider;

var timeScale;
var currentDateDisplay;
var dateFormat;

