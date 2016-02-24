/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("script!kodama");
var d3 = require('d3');
require("script!./d3-legend.js");
var utils = require('./utils.js');
var global = require('./global.js');
// require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//

var countsLayer;
var countDefaultColorIndex = 1;
var countOpacity = 0.3;

d3.kodama
		.themeRegistry(
				'countsTheme',
				{
					frame : {
						padding : '4px',
						background : 'linear-gradient(to top, rgb(177, 68, 68) 0%, rgb(188, 95, 95) 90%)',
						'font-family' : '"Helvetica Neue", Helvetica, Arial, sans-serif',
						'border' : '1px solid rgb(57, 208, 204)',
						color : 'rgb(245,240,220)',
						'border-radius' : '4px',
						'font-size' : '12px',
						'box-shadow' : '0px 1px 3px rgba(0,20,40,.5)'
					},
					title : {
						'text-align' : 'center',
						'padding' : '4px'
					},
					item_title : {
						'text-align' : 'right',
						'color' : 'rgb(220,200,120)'
					},
					item_value : {
						'padding' : '1px 2px 1px 10px',
						'color' : 'rgb(234, 224, 184)'
					}
				});

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateCountsLayer = function(counts_, countAttribute) {

	var min_area = 1000;
	var max_area = 10000;
	var scale = d3.scale.linear().domain(countAttribute.range).range(
			[ min_area, max_area ]);

	countsLayer = global.g.append("g").attr("class", "countsLayer");

	var counts = countsLayer.selectAll("circle").data(counts_).enter() //
	.append("circle") //
	.attr("class", "count") //
	.attr("startTime", function(d) {

		return (d.startTime);

	}) //
	.attr("endTime", function(d) {

		return (d.endTime);

	}) //
	.attr("cx", function(d) {

		var xy = global.projection([ d.location.coordinate.xCoordinate, // long
		d.location.coordinate.yCoordinate // lat
		]);

		var cx = xy[0]; // long

		return (cx);
	}) //
	.attr("cy", function(d) {

		var xy = global.projection([ d.location.coordinate.xCoordinate, // long
		d.location.coordinate.yCoordinate // lat
		]);

		var cy = xy[1]; // lat

		return (cy);
	}) //
	.attr("r", function(d) {

		var count = d.attributes.count;
		var area = scale(count);
		var radius = Math.sqrt(area / Math.PI);

		return (radius);

	}) //
	.attr("fill", global.fixedColors[countDefaultColorIndex]) //
	.attr("stroke-width", "0.5px") //
	.attr("fill-opacity", countOpacity) //
	.attr("visibility", "visible") //
	.on('mouseover', function(d) {

		var point = d3.select(this);
		point.attr('stroke', '#000');

	}) //
	.on('mouseout', function(d, i) {

		var point = d3.select(this);
		point.attr('stroke', null);

	}) //
	.call(d3.kodama.tooltip().format(function(d, i) {

		return {
			title : d.location.id,
			items : [ {
				title : 'Date',
				value : d.startTime
			}, {
				title : 'Count',
				value : d.attributes.count
			} ]
		};

	}) //
	.theme('countsTheme'));

	// dump attribute values into DOM
	counts[0].forEach(function(d, i) {

		var thisArea = d3.select(d);

		var properties = counts_[i].attributes;
		for ( var property in properties) {
			if (properties.hasOwnProperty(property)) {

				thisArea.attr(property, properties[property]);

			}
		}// END: properties loop
	});

}// END: generateCountsLayer

exports.updateCountsLayer = function(value) {

	// ---select counts yet to be displayed or already displayed---//

	countsLayer.selectAll(".count") //
	.filter(
			function(d) {
				var point = this;
				var startDate = utils
						.formDate(point.attributes.startTime.value).getTime();
				var endDate = utils.formDate(point.attributes.endTime.value)
						.getTime();

				return (value < startDate || value > endDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "hidden");

	// ---select counts displayed now---//

	countsLayer.selectAll(".count") //
	.filter(
			function() {
				var point = this;
				var startDate = utils
						.formDate(point.attributes.startTime.value).getTime();
				var endDate = utils.formDate(point.attributes.endTime.value)
						.getTime();

				return (value > startDate && value < endDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "visible");

}// END: updateCountsLayer

