//require("script!kodama.js");

var exports = module.exports = {};

var margin = {
	top : 30,
	right : 50,
	bottom : 50,
	left : 200,
};
exports.margin = margin;

var width = 1100 - margin.left - margin.right;
exports.width = width;

var height = 1100 - margin.top - margin.bottom;
exports.height = height;

var g;
exports.g = g;

var minScaleExtent = 1;
exports.minScaleExtent = minScaleExtent;
var maxScaleExtent = 5;
exports.maxScaleExtent = maxScaleExtent;

// var lineAttributes;
// var pointAttributes;
//
// var areasLayer ;
// exports.areasLayer = areasLayer;
// var linesLayer ;
// exports.linesLayer = linesLayer;
// var pointsLayer;
// exports.pointsLayer = pointsLayer;
//
// //var minScaleExtent = 1;
// //exports.minScaleExtent=minScaleExtent;
// //var maxScaleExtent = 5;
// //exports.maxScaleExtent = maxScaleExtent;
// var lineWidth = 2;
//
// // time slider
// var playing = false;
// exports.playing = playing;
//
// var processID;
// //var currentSliderValue;
// var sliderInterval;
// var sliderStartValue;
// exports.sliderStartValue = sliderStartValue;
// var sliderEndValue;
// exports.sliderEndValue = sliderEndValue;
//
// var timeSlider;
// //exports.timeSlider = timeSlider;
//
// var timeScale;
// var currentDateDisplay;
// //exports.currentDateDisplay = currentDateDisplay;
// var dateFormat;
//
