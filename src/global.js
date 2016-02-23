//require("script!kodama.js");

// ---MODULE IMPORTS---//

var colorbrewer = require("colorbrewer");

//---MODULE EXPORTS---//

var exports = module.exports = {};

var COUNT = "count";
exports.COUNT = COUNT;

var ORDINAL = "ordinal";
exports.ORDINAL = ORDINAL;

var LINEAR = "linear";
exports.LINEAR = LINEAR;

var MIN_INDEX = 0;
exports.MIN_INDEX = MIN_INDEX;

var MAX_INDEX = 1;
exports.MAX_INDEX = MAX_INDEX;

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

//fixed colors
var fixedColors = colorbrewer.RdYlBu[11];
fixedColors.splice(6, 0, "#ffffff");
fixedColors.push("#000000");
exports.fixedColors = fixedColors;

//colors for mappings (paired for better interpolating)
var pairedSimpleColors = colorbrewer.Paired[12];
exports.pairedSimpleColors = fixedColors;

// colors for categorical attributes
var ordinalColors = d3.scale.category20().range();// ordinalColors = colorbrewer.Blues[3] ;
exports.ordinalColors = fixedColors;

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
