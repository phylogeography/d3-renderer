/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require('./topo.css');
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var topoLayer;

var mapDefaultColorIndex = 6;
var mapFillOpacity = 0.5;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateTopoLayer = function(geojson) {

//	 equatorLayer = g.append("g");
	topoLayer = global.g.append("g");
	
	var basicScale = (global.width / 2 / Math.PI);

	// first guess for the projection
	var center = d3.geo.centroid(geojson);

	var projectionScale = basicScale;
	var offset = [ global.width / 2, global.height / 2 ];

	global.projection = d3.geo.mercator().scale(projectionScale).center(center)
			.translate(offset);

	var path = d3.geo.path().projection(global.projection);

	// determine the bounds
	var bounds = path.bounds(geojson);
	var hscale = projectionScale * global.width / (bounds[1][0] - bounds[0][0]);
	var vscale = projectionScale * global.height / (bounds[1][1] - bounds[0][1]);
	projectionScale = (hscale < vscale) ? hscale : vscale;
	var offset = [ global.width - (bounds[0][0] + bounds[1][0]) / 2,
	               global.height - (bounds[0][1] + bounds[1][1]) / 2 ];

	// new projection
	global.projection = d3.geo.mercator().center(center).scale(projectionScale)
			.translate(offset);

	// if it failed stick to basics
	if (projectionScale < basicScale) {

		projectionScale = (global.width / 2 / Math.PI);
		var offset = [ (global.width / 2), (global.height / 2) ];

		global.projection = d3.geo.mercator() //
		.scale(projectionScale) //
		.translate(offset);

	}

	// new path
	path = path.projection(global.projection);

	// add graticule
//	svg.append("path").datum(graticule).attr("class", "graticule").attr("d",
//			path);
//
//	// apply inline style
//	svg.selectAll('.graticule').style({
//		'stroke' : '#bbb',
//		'fill' : 'none',
//		'stroke-width' : '.5px',
//		'stroke-opacity' : '.5'
//	});
//
//	// add equator
//	equatorLayer.append("path").datum(
//			{
//				type : "LineString",
//				coordinates : [ [ -180, 0 ], [ -90, 0 ], [ 0, 0 ], [ 90, 0 ],
//						[ 180, 0 ] ]
//			}).attr("class", "equator").attr("d", path);
//
//	// apply inline style
//	equatorLayer.selectAll('.equator').style({
//		'stroke' : '#ccc',
//		'fill' : 'none',
//		'stroke-width' : '1px',
//	});

	var features = geojson.features;
	var topo = topoLayer.selectAll("path").data(features).enter()
			.append("path") //
			.attr("class", "topo") //
			.attr('d', path) //
			.attr("fill", global.fixedColors[mapDefaultColorIndex]) //
			.attr("stroke", "black") //
			.attr("fill-opacity", mapFillOpacity) //
			.style("stroke-width", .5);

	// dump attribute values into DOM
	topo[0].forEach(function(d, i) {

		var thisTopo = d3.select(d);
		var properties = geojson.features[i].properties;

		for ( var property in properties) {
			if (properties.hasOwnProperty(property)) {

				thisTopo.attr(property, properties[property]);

			}
		}// END: properties loop
	});

}// END: generateTopoLayer

exports.generateEmptyTopoLayer = function(pointAttributes, axisAttributes) {

	console.log("generateEmptyLayer");

	var xlim = utils.getObject(pointAttributes, "id",
			axisAttributes.xCoordinate).range;
	var ylim = utils.getObject(pointAttributes, "id",
			axisAttributes.yCoordinate).range;
	// ylim = [ ylim[0] - 2, ylim[1] + 2 ];

	console.log("width: " + global.width);
	console.log("height: " + global.height);

	console.log("xlim: " + xlim);
	console.log("ylim: " + ylim);

	// reversed because coordinates come as lat (y), long (x)
	var bounds = [ ylim, xlim ];

	// maxX = xlim[0];
	console.log("bounds: " + bounds);

	var hscale = global.height / (bounds[0][1] - bounds[0][0]);
	var vscale = global.width / (bounds[1][1] - bounds[1][0]);

	console.log("hscale: " + hscale);
	console.log("vscale: " + vscale);

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
		// return [ x, y ];
		return [ x, y ];
	});

	// test projection
	console.log("test projection [0,0]: " + zeroProjection([ 0, 0 ]));
	console.log("test projection [0,1]: " + zeroProjection([ 0, 1 ]));
	console.log("test projection [1,0]: " + zeroProjection([ 1, 0 ]));
	console.log("test projection [1,1]: " + zeroProjection([ 1, 1 ]));

	var currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	var currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];
	console.log("current X difference: " + currentXDifference);
	console.log("current Y difference: " + currentYDifference);

	projectionScale = global.minScaleExtent * projectionScale
			/ currentXDifference;

	global.projection = zeroProjection.scale(projectionScale);

	currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

	console.log("current X difference: " + currentXDifference);
	console.log("current Y difference: " + currentYDifference);

	global.projection = zeroProjection.translate(
			[
					global.width / 2 + (bounds[1][0] + bounds[1][1]) / 2
							* currentYDifference,

					global.height / 2 + (bounds[0][0] + bounds[0][1]) / 2
							* currentXDifference ] //
	).scale(projectionScale

	);

}// END: generateEmptyLayer

// ---FUNCTIONS---//
