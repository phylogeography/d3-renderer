/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//

require('./topo.css');
var d3 = require('d3');
require("script!./d3-legend.js");
require("imports?$=jquery!./jquery.simple-color.js");
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var topoLayer;
var equatorLayer ;

var mapDefaultColorIndex = 6;
var mapStartColor = global.pairedSimpleColors[0];
var mapEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];

var mapFixedOpacity = 0.5;
var min_map_opacity = 0.1;
var max_map_opacity = 1;

var backgroundColors =	[ "#ffffff", "#000000", "#ddd", "#8cc5ff" ];
var backgrounDefaultColorIndex = 0; //0

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
	// svg.append("path").datum( d3.geo.graticule()).attr("class", "graticule").attr("d",
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
			.style("stroke-width", 0.5);

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

updateMapBackground(backgroundColors[backgrounDefaultColorIndex]);
}// END: generateTopoLayer

exports.generateEmptyTopoLayer = function(pointAttributes, axisAttributes) {

	//console.log("generateEmptyLayer");

	var xlim = utils.getObject(pointAttributes, "id",
			axisAttributes.xCoordinate).range;
	var ylim = utils.getObject(pointAttributes, "id",
			axisAttributes.yCoordinate).range;

	/*console.log("width: " + global.width);
	console.log("height: " + global.height);
	console.log("xlim: " + xlim);
	console.log("ylim: " + ylim);*/

	// reversed because coordinates come as lat (y), long (x)
	var bounds = [ ylim, xlim ];

	/*console.log("bounds: " + bounds);
    console.log("bounds[0][0] = " + bounds[0][0]);
    console.log("bounds[0][1] = " + bounds[0][1]);
    console.log("bounds[1][0] = " + bounds[1][0]);
    console.log("bounds[1][1] = " + bounds[1][1]);*/

    var vscale = global.height / (bounds[0][1] - bounds[0][0]);
    var hscale = global.width / (bounds[1][1] - bounds[1][0]);

	//console.log("hscale: " + hscale);
	//console.log("vscale: " + vscale);

	var projectionScale = (hscale < vscale) ? hscale : vscale;
  projectionScale = projectionScale * 100;

    //console.log("projectionScale: " + projectionScale);

	// define null projection
	var zeroProjection = d3.geo.projection(function(x, y) {
		return [ x, y ];
	});

	var currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	var currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

	projectionScale = global.minScaleExtent * projectionScale
			/ currentXDifference;

	global.projection = zeroProjection.scale(projectionScale);

	currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

    //console.log("currentXDifference: " + currentXDifference);
    //console.log("currentYDifference: " + currentYDifference);

	global.projection = zeroProjection.translate(
			[
					global.width / 2 + (bounds[1][0] + bounds[1][1]) / 2
							* currentYDifference,

					global.height / 2 + (bounds[0][0] + bounds[0][1]) / 2
							* currentXDifference ] //
	).scale(projectionScale);

    // test projection
    /*console.log("global.projection([xlim[0],ylim[0])[0]: " + global.projection([xlim[0],ylim[0]])[0]);
    console.log("global.projection([xlim[0],ylim[0])[1]: " + global.projection([xlim[0],ylim[0]])[1]);
    console.log("global.projection([xlim[1],ylim[1])[0]: " + global.projection([xlim[1],ylim[1]])[0]);
    console.log("global.projection([xlim[1],ylim[1])[1]: " + global.projection([xlim[1],ylim[1]])[1]);*/
    /*console.log("global.projection([0,0])[0]: " + global.projection([0,0])[0]);
    console.log("global.projection([0,0])[1]: " + global.projection([0,0])[1]);
    console.log("global.projection([1,1])[0]: " + global.projection([1,1])[0]);
    console.log("global.projection([1,1])[1]: " + global.projection([1,1])[1]);*/

    var xOffset = global.projection([xlim[1],ylim[1]])[0] - global.projection([xlim[0],ylim[0]])[0];
    var yOffset = global.projection([xlim[0],ylim[0]])[1] - global.projection([xlim[1],ylim[1]])[1];

    var addedXAxis = global.margin.left/currentXDifference;
    var addedYAxis = -global.margin.bottom/currentYDifference;
    //console.log("addedXAxis: " + addedXAxis);
    //console.log("addedYAxis: " + addedYAxis);

    // x axis
    //var xScale = d3.scale.linear().domain(xlim).nice().range([ 0, global.width ]);
    //var xScale = d3.scale.linear().domain(xlim).range([ global.projection([xlim[0],ylim[0]])[0], global.projection([ xlim[1], ylim[1] ])[0] ]);

    //try the xScale below to make the axes intersect
    var xScale = d3.scale.linear().domain([xlim[0]-addedXAxis,xlim[1]+addedXAxis]).range([ global.projection([xlim[0]-addedXAxis,ylim[0]])[0]-0, global.projection([ xlim[1]+addedXAxis, ylim[1] ])[0]+0]);

    // x axis
    //var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(
    //    -global.height).outerTickSize(0).ticks(xlim[1]-xlim[0]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(
        -yOffset - 2*global.margin.bottom).outerTickSize(0).ticks(xlim[1]-xlim[0]);

    // add the x axis
    var xAxisLayer = global.g.append("g").attr("class", "x axis");
    //xAxisLayer.attr("transform", "translate(0," + global.height + ")").call(xAxis);
    xAxisLayer.attr("transform", "translate(0," + (global.projection([xlim[0],ylim[0]])[1] + global.margin.bottom) + ")").call(xAxis);

    // x axis title
    global.g.append("text").attr("class", "x label").attr("text-anchor",
        "middle").attr("x", global.width / 2).attr("y",
        (global.projection([xlim[0],ylim[0]])[1] + global.margin.bottom) + global.margin.bottom - 20).style("font-size",
        "18px") //
        .style({
            'stroke' : 'Black',
            'fill' : 'Black',
            'stroke-width' : '0.5px'
        }).text(utils.capitalizeFirstLetter(axisAttributes.xCoordinate));

    // y axis
    //var yScale = d3.scale.linear().domain(ylim).nice().range([ global.height, 0 ]);
    //var yScale = d3.scale.linear().domain(ylim).range([ global.projection([xlim[0],ylim[0]])[1], global.projection([ xlim[1], ylim[1] ])[1] ]);

    //try the yScale below to make the axes intersect
    var yScale = d3.scale.linear().domain([ylim[0]-addedYAxis,ylim[1]+addedYAxis]).range([ global.projection([xlim[0],ylim[0]-addedYAxis])[1]-0, global.projection([ xlim[1], ylim[1]+addedYAxis ])[1]+0]);

    //var yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(
    //    -global.width).outerTickSize(0).ticks(ylim[1]-ylim[0]);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(
        -xOffset - 2*global.margin.left).outerTickSize(0).ticks(ylim[1]-ylim[0]);

    var yAxisLayer = global.g.append("g").attr("class", "y axis");
    //yAxisLayer.attr("transform", "translate(" + (global.margin.left + 20) + ",0)").call(yAxis);
    yAxisLayer.attr("transform", "translate(" + (global.projection([xlim[0],ylim[0]])[0] - global.margin.left) + ",0)").call(yAxis);

    // y axis title
    global.g.append("text").attr("class", "y label") //
        .attr("text-anchor", "middle") //
        .attr("transform", "translate(" + ((global.projection([xlim[0],ylim[0]])[0] - global.margin.left - 20)) + "," + (global.height / 2) + ")rotate(-90)") //
        .style("font-size", "18px") //
        .style({
            'stroke' : 'Black',
            'fill' : 'Black',
            'stroke-width' : '0.5px'
        }) //
        .text(utils.capitalizeFirstLetter(axisAttributes.yCoordinate));

    updateMapBackground(backgroundColors[backgrounDefaultColorIndex]);
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

  var str = ("				<div class=\"panelcollapsed\">")+
   ("					<h2>Background color<\/h2>")+
  ("					<div class=\"panelcontent\">")+
  ("						<select id=\"mapbackground\">")+
  ("						<\/select>")+
  ("					 <div id=\"mapBackgroundLegend\" class=\"legend\"><\/div>")+
  ("					<\/div>")+
  ("				<\/div>");

	var html = $.parseHTML(str);

	$(".selectors").append(html);

	var mapBackgroundSelect = document.getElementById("mapbackground");

	// var domain = [ "white", "black", "grey", "light blue" ];
	var scale = utils.alternatingColorScale().domain(backgroundColors).range(
			backgroundColors);

	for (var i = 0; i < backgroundColors.length; i++) {

		var option = backgroundColors[i];
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

						// d3.select('.container').style("background", color);
            updateMapBackground(color);

						// setup legend
						updateMapBackgroundLegend(scale);
					});

}// END:setupTopoBackgroundPanel

updateMapBackground = function(color) {
	d3.select('.svg').style({
		// "fill": color,
	 //  "color" :color,
     "background" : color
	});
}//END: updateMapBackground

updateMapBackgroundLegend = function(scale) {

	var width = 150;
	var height = 100;

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

  var str = ("				<div class=\"panelcollapsed\">")+
   ("					<h2>Map fixed opacity<\/h2>")+
   ("					<div class=\"panelcontent\">")+
   ("							<div id=\"mapFixedOpacitySlider\"><\/div>")+
   ("					<\/div>")+
   ("				<\/div>");

	 var html = $.parseHTML(str);

	 $(".selectors").append(html);

	$('#mapFixedOpacitySlider').html('<input type="range" class="mapFixedOpacitySlider" step="0.1" min="' + min_map_opacity + '" max="' + max_map_opacity + '" value="'+mapFixedOpacity+'"  />');
	$('#mapFixedOpacitySlider').append('<span>' + mapFixedOpacity + '</span>');

	$('.mapFixedOpacitySlider').on("input", function() {

	mapFixedOpacity = $(this).val();

	 $(this).next().html(mapFixedOpacity);

	 	// fill-opacity / stroke-opacity / opacity
 		topoLayer.selectAll(".topo") //
 		.transition() //
 		.ease("linear") //
 		.attr("fill-opacity", mapFixedOpacity);

		});

}// END:setupTopoFixedOpacityPanel

setupTopoColorAttributePanel = function(attributes) {

  var str = ("				<div class=\"panelcollapsed\">") +
  ("					<h2>Map color attribute<\/h2>") +
   ("					<div class=\"panelcontent\">") +
   ("						<div id='mapStartColor'>") +
   ("						<\/div>") +
   ("						<div id='mapEndColor'>") +
   ("						<\/div>") +
   ("						<h4>Attribute<\/h4>")+
   ("						<select id=\"mapColorAttribute\">")+
   ("						<\/select>") +
   ("						<div id=\"mapColorLegend\"><\/div>")+
   ("					<\/div>")+
   ("				<\/div>");

	 var html = $.parseHTML(str);

	 $(".selectors").append(html);

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

 var str = ("				<div class=\"panelcollapsed\">")+
 ("					<h2>Map color<\/h2>")+
 ("					<div class=\"panelcontent\">")+
 ("						<select id=\"mapFixedColor\">")+
 ("						<\/select>")+
 ("						<div id=\"mapFixedColorLegend\" ><\/div>")+
   ("					<\/div>")+
   ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

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
