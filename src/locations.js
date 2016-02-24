/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var locationsLayer;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateLocationsLayer = function(locations_) {

	locationsLayer = global.g.append("g").attr("class", "locationsLayer");

	var locations = locationsLayer.selectAll("circle").data(locations_).enter()
			.append("circle") //
			.attr("class", "location") //
			.attr("cx", function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
				d.coordinate.yCoordinate // lat
				]);

				var cx = xy[0]; // long

				return (cx);
			}) //
			.attr("cy", function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
				d.coordinate.yCoordinate // lat
				]);

				var cy = xy[1]; // lat

				return (cy);
			}) //
			.attr("r", ".1px") //
			.attr("fill", "black") //
			.attr("stroke", "black");

}// END: generateLocationsLayer

exports.generateLabels = function(locations_) {

	var labels = locationsLayer.selectAll("text").data(locations_).enter().append("text") //
	.attr("class", "label") //
	.attr(
			"x",
			function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
						d.coordinate.yCoordinate // lat
						]);
				
				var x = xy[0]; // long

				return (x);
			}) //
	.attr(
			"y",
			function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
						d.coordinate.yCoordinate // lat
						]);
				
				var y = xy[1]; // lat

				return (y);
			}) //
	.text(function(d) {
		
		return (d.id);
	}) //
	.attr("font-family", "sans-serif")//
	.attr("font-size", "10px")//
	.attr("fill", "black") //
	;

}// END: generateLocationsLayer

// ---MODULE FUNCTIONS---//
