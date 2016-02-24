/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require('./topo.css');
var d3 = require('d3');
require("script!./d3-legend.js");
var utils = require('./utils.js');
var global = require('./global.js');

require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//

var topoLayer;

var mapDefaultColorIndex = 6;
var mapStartColor = global.pairedSimpleColors[0];
var mapEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];
var mapFixedOpacity = 0.5;
var min_map_opacity = 0.1;
var max_map_opacity = 1;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateTopoLayer = function(geojson) {

	// equatorLayer = g.append("g");
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
	var vscale = projectionScale * global.height
			/ (bounds[1][1] - bounds[0][1]);
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
	// svg.append("path").datum(graticule).attr("class", "graticule").attr("d",
	// path);
	//
	// // apply inline style
	// svg.selectAll('.graticule').style({
	// 'stroke' : '#bbb',
	// 'fill' : 'none',
	// 'stroke-width' : '.5px',
	// 'stroke-opacity' : '.5'
	// });
	//
	// // add equator
	// equatorLayer.append("path").datum(
	// {
	// type : "LineString",
	// coordinates : [ [ -180, 0 ], [ -90, 0 ], [ 0, 0 ], [ 90, 0 ],
	// [ 180, 0 ] ]
	// }).attr("class", "equator").attr("d", path);
	//
	// // apply inline style
	// equatorLayer.selectAll('.equator').style({
	// 'stroke' : '#ccc',
	// 'fill' : 'none',
	// 'stroke-width' : '1px',
	// });

	var features = geojson.features;
	var topo = topoLayer.selectAll("path").data(features).enter()
			.append("path") //
			.attr("class", "topo") //
			.attr('d', path) //
			.attr("fill", global.fixedColors[mapDefaultColorIndex]) //
			.attr("stroke", "black") //
			.attr("fill-opacity", mapFixedOpacity) //
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

exports.setupPanels = function(attributes) {

	setupTopoLayerCheckbox();
	setupTopoFixedColorPanel();
	setupTopoColorAttributePanel(attributes);
	setupTopoFixedOpacityPanel();
	setupTopoBackgroundPanel();

}// END: setupPanels

// ---FUNCTIONS---//

setupTopoBackgroundPanel = function() {

	var mapBackgroundSelect = document.getElementById("mapbackground");

	var domain = [ "white", "black", "grey", "light blue" ];
	var scale = utils.alternatingColorScale().domain(domain).range(
			[ "#ffffff", "#000000", "#ddd", "#8cc5ff" ]);

	for (var i = 0; i < domain.length; i++) {

		var option = domain[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapBackgroundSelect.appendChild(element);

	}// END: i loop

	// map background listener
	d3
			.select(mapBackgroundSelect)
			.on(
					'change',
					function() {

						var colorSelect = mapBackgroundSelect.options[mapBackgroundSelect.selectedIndex].text;
						var color = scale(colorSelect);
						d3.select('.container').style("background", color);

						// setup legend
						updateMapBackgroundLegend(scale);

					});

}// END:setupTopoBackgroundPanel

updateMapBackgroundLegend = function(scale) {

	var width = 150;
	var height = 250;

	var margin = {
		left : 20,
		top : 20
	};

	$('#mapBackgroundLegend').html('');
	var svg = d3.select("#mapBackgroundLegend").append('svg').attr("width",
			width).attr("height", height);

	var mapBackgroundLegend = d3.legend.color().scale(scale).shape('rect')
			.shapeHeight(10).shapeWidth(10).shapePadding(10).cells(5).orient(
					'vertical')

	svg.append("g").attr("class", "mapBackgroundLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
			mapBackgroundLegend);

}// END:updateMapBackgroundLegend

setupTopoFixedOpacityPanel = function() {

	var step = 0.1;

	var mapFixedOpacitySlider = d3.slider().axis(
			d3.svg.axis().orient("top").ticks(
					(max_map_opacity - min_map_opacity) / step)).min(
			min_map_opacity).max(max_map_opacity).step(0.1).value(
			mapFixedOpacity);

	d3.select('#mapFixedOpacitySlider').call(mapFixedOpacitySlider);

	// map fixed opacity listener
	mapFixedOpacitySlider.on("slide", function(evt, value) {

		mapFixedOpacity = value;

		// fill-opacity / stroke-opacity / opacity
		topoLayer.selectAll(".topo") //
		.transition() //
		.ease("linear") //
		.attr("fill-opacity", mapFixedOpacity);

	});

}// END:setupTopoFixedOpacityPanel

setupTopoColorAttributePanel = function(attributes) {

	// attribute
	var mapColorAttributeSelect = document.getElementById("mapColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		var option = attributes[i].id;
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapColorAttributeSelect.appendChild(element);

	}// END: i loop

	// map color listener
	d3
			.select(mapColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = mapColorAttributeSelect.options[mapColorAttributeSelect.selectedIndex].text;

						var attribute = utils.getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#mapStartColor').html('');
						$('#mapEndColor').html('');

						if (attribute.scale == global.ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.ordinal().range(
									global.ordinalColors).domain(data);

							updateMapColorLegend(scale);

						} else if (attribute.scale == LINEAR) {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ mapStartColor, mapEndColor ]);

							updateMapColorLegend(scale);

							// start color
							$('#mapStartColor').html("<h4>Start color<\/h4>");
							$('#mapStartColor').append(
									"<input class=\"mapStartColor\" \/>");

							$('.mapStartColor')
									.simpleColor(
											{
												cellWidth : 13,
												cellHeight : 13,
												columns : 4,
												displayColorCode : true,
												colors : utils
														.getSimpleColors(global.pairedSimpleColors),

												onSelect : function(hex,
														element) {

													mapStartColor = "#" + hex;

													scale.range([
															mapStartColor,
															mapEndColor ]);

													updateMapColorLegend(scale);

													// trigger repaint
													updateMapColors(scale,
															colorAttribute);

												}// END: onSelect
											});

							$('.mapStartColor').setColor(mapStartColor);

							// end color
							$('#mapEndColor').html("<h4>End color<\/h4>");
							$('#mapEndColor').append(
									"<input class=\"mapEndColor\" \/>");

							$('.mapEndColor')
									.simpleColor(
											{
												cellWidth : 13,
												cellHeight : 13,
												columns : 4,
												colors : utils
														.getSimpleColors(global.pairedSimpleColors),
												displayColorCode : true,
												onSelect : function(hex,
														element) {

													mapEndColor = "#" + hex;

													scale.range([
															mapStartColor,
															mapEndColor ]);

													updateMapColorLegend(scale);

													// trigger repaint
													updateMapColors(scale,
															colorAttribute);
												}// END: onSelect
											});

							$('.mapEndColor').setColor(mapEndColor);

						} else {

							console
									.log("Error occured when resolving scale type!");

						}

						// trigger repaint
						updateMapColors(scale, colorAttribute);

					});

}// END: setupTopoColorAttributePanel

updateMapColorLegend = function(scale) {

	var width = 150;
	var height = 250;

	var margin = {
		left : 20,
		top : 20
	};

	$('#mapColorLegend').html('');
	var svg = d3.select("#mapColorLegend").append('svg').attr("width", width)
			.attr("height", height);

	var mapColorLegend = d3.legend.color().scale(scale).shape('rect')
			.shapeHeight(10).shapeWidth(10).shapePadding(5).cells(5).orient(
					'vertical')

	svg.append("g").attr("class", "mapColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
			mapColorLegend);

}// END:updateMapColorLegend

updateMapColors = function(scale, colorAttribute) {

	d3.selectAll(".topo") //
	.transition() //
	.ease("linear") //
	.attr("fill", function() {

		var topo = d3.select(this);
		var attributeValue = topo.attr(colorAttribute);
		var color = scale(attributeValue);

		return (color);
	});

}// END:updateMapColors

setupTopoFixedColorPanel = function() {

	var mapFixedColorSelect = document.getElementById("mapFixedColor");
	var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
			global.fixedColors);

	for (var i = 0; i < global.fixedColors.length; i++) {

		var option = global.fixedColors[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		mapFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	mapFixedColorSelect.selectedIndex = mapDefaultColorIndex;

	// map fixed color listener
	d3
			.select(mapFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = mapFixedColorSelect.options[mapFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						d3.selectAll(".topo") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

						// setup legend
						updateMapFixedColorLegend(scale);

					});

}// END: setupTopoFixedColorPanel

updateMapFixedColorLegend = function(scale) {

	var width = 150;
	var height = 230;

	var margin = {
		left : 20,
		top : 20
	};

	$('#mapFixedColorLegend').html('');
	var svg = d3.select("#mapFixedColorLegend").append('svg').attr("width",
			width).attr("height", height);

	var mapFixedColorLegend = d3.legend.color().scale(scale).shape('rect')
			.shapeHeight(10).shapeWidth(10).shapePadding(5).cells(5).orient(
					'vertical')

	svg.append("g").attr("class", "mapFixedColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
			mapFixedColorLegend);

}// END: updateMapFixedColorLegend

setupTopoLayerCheckbox = function() {

	$('#layerVisibility').append(
			"<input type=\"checkbox\" id=\"mapLayerCheckbox\"> Map layer<br>");

	var mapLayerCheckbox = document.getElementById("mapLayerCheckbox");
	// default state is checked
	mapLayerCheckbox.checked = true;

	d3.select(mapLayerCheckbox).on("change", function() {

		var visibility = this.checked ? "visible" : "hidden";
		topoLayer.selectAll("path").style("visibility", visibility);

	});

}// END: setupTopoLayerCheckbox

