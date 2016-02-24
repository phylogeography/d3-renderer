/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require('./topo.css');
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateEmptyTopoLayer = function(pointAttributes, axisAttributes) {

	var xlim = utils.getObject(pointAttributes, "id",
			axisAttributes.xCoordinate).range;
	var ylim = utils.getObject(pointAttributes, "id",
			axisAttributes.yCoordinate).range;
	// ylim = [ ylim[0] - 2, ylim[1] + 2 ];

	var bounds = [ xlim, ylim ];

	// maxX = xlim[0];

	var hscale = global.height / (bounds[0][1] - bounds[0][0]);
	var vscale = global.width / (bounds[1][1] - bounds[1][0]);

	var projectionScale = (hscale < vscale) ? hscale : vscale;
	projectionScale = projectionScale * 150;

	// x axis  
	var xScale = d3.scale.linear().domain(xlim).nice().range(
			[ 0, global.width ]);

	// x axis 
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(
			-global.height).outerTickSize(0);

	// add the x axis
	var xAxisLayer = global.g.append("g").attr("class", "x axis");
	xAxisLayer.attr("transform", "translate(0," + global.height + ")").call(
			xAxis);

	// x axis title
	global.g.append("text").attr("class", "x label").attr("text-anchor",
			"middle").attr("x", global.width / 2).attr("y",
			global.height + global.margin.bottom - 10).style("font-size",
			"18px") //
	.style({
		'stroke' : 'Black',
		'fill' : 'Black',
		'stroke-width' : '0.5px'
	}).text(utils.capitalizeFirstLetter(axisAttributes.xCoordinate));

	// remove the first tick
	global.g.selectAll(".tick").filter(function(d) {
		return d === xScale.domain()[0];
	}).remove();

	// y axis 
	var yScale = d3.scale.linear().domain(ylim).nice().range(
			[ global.height, 0 ]);

	var yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(
			-global.width).outerTickSize(0);
	var yAxisLayer = global.g.append("g").attr("class", "y axis");
	yAxisLayer.call(yAxis);

	// y axis title
	global.g.append("text") //
	.attr("class", "y label") //
	.attr("text-anchor", "middle") //
	// .attr("x", 0).attr("y", width / 2)
	// .attr("transform","rotate(-90)")
	.attr("transform",
			"translate(" + (40) + "," + (global.height / 2) + ")rotate(-90)") //
	.style("font-size", "18px") //
	.style({
		'stroke' : 'Black',
		'fill' : 'Black',
		'stroke-width' : '0.5px'
	}) //
	.text(utils.capitalizeFirstLetter(axisAttributes.yCoordinate));

	// define null projection
	var zeroProjection = d3.geo.projection(function(x, y) {
		return [ x, y ];
//		return [ y, x ];
	});

//	var currentXDifference = zeroProjection([ 1, 1 ])[0]
//			- zeroProjection([ 0, 0 ])[0];
//	var currentYDifference = zeroProjection([ 1, 1 ])[1]
//			- zeroProjection([ 0, 0 ])[1];

	var currentYDifference = zeroProjection([ 1, 1 ])[0]
	- zeroProjection([ 0, 0 ])[0];
var currentXDifference = zeroProjection([ 1, 1 ])[1]
	- zeroProjection([ 0, 0 ])[1];
	
	
	projectionScale = global.minScaleExtent * projectionScale / currentXDifference;

	// TODO: make global
	projection = zeroProjection.scale(projectionScale);

	currentYDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	currentXDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

	projection = zeroProjection.translate(
			[
					global.width / 2 + (bounds[1][0] + bounds[1][1]) / 2
							* currentXDifference,
							
					global.height / 2 + (bounds[0][0] + bounds[0][1]) / 2
							* currentYDifference ]).scale(projectionScale
									
							
							);

}// END: generateEmptyLayer

// ---FUNCTIONS---//
