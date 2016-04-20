/**
 * @fbielejec
 */


// ---MODULE IMPORTS---//

var colorbrewer = require("colorbrewer");

//---MODULE EXPORTS---//

var exports = module.exports = {};

var hasTime = false;
exports.hasTime = hasTime;

var hasPoints = false;
exports.hasPoints = hasPoints;

var hasLines = false;
exports.hasLines = hasLines;

var hasAreas = false;
exports.hasAreas = hasAreas;

var hasCounts = false;
exports.hasCounts = hasCounts;

var hasLocations = false;
exports.hasLocations = hasLocations;

//var COUNT = "count";
//exports.COUNT = COUNT;

var ORDINAL = "ordinal";
exports.ORDINAL = ORDINAL;

var LINEAR = "linear";
exports.LINEAR = LINEAR;

var MIN_INDEX = 0;
exports.MIN_INDEX = MIN_INDEX;

var MAX_INDEX = 1;
exports.MAX_INDEX = MAX_INDEX;

var margin = {
	top : 50,
	right : 0,
	bottom : 50,
	left : 50,
};
exports.margin = margin;

var width = window.innerWidth - margin.left - margin.right;
exports.width = width;

var height = window.innerHeight - margin.top - margin.bottom;
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
var ordinalColors = d3.scale.category20().range();
// var ordinalColors = colorbrewer.Set1[9] ;
exports.ordinalColors = ordinalColors;

var projection;
exports.projection = projection;
