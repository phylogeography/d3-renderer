/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("./main.css");
var collapsible = require("./collapsible.js");
var d3 = require('d3');
var global = require('./global.js');
var utils = require('./utils.js');
var time = require("./time.js");
var topo = require('./topo.js');
var points = require('./points.js');
var lines = require('./lines.js');
var areas = require('./areas.js');
var counts = require('./counts.js');
var locations = require('./locations.js');

// ---HTML---//

createHtml();
collapsible.setUpPanels();

// ---MODULE VARIABLES---//

var zoom = d3.behavior.zoom().scaleExtent(
		[ global.minScaleExtent, global.maxScaleExtent ]).center(
		[ global.width / 2, global.height / 2 ]).size(
		[ global.width, global.height ]).on("zoom", move);

var svg = d3.select(".container").append('svg') //
.attr("width", global.width + global.margin.left + global.margin.right) //
.attr("height", global.height + global.margin.top + global.margin.bottom) //
.call(zoom);

global.g = svg.append("g");

var MAP = "map";
var TREE = "tree";
var COUNTS = "counts";
var COUNT = "count";

// ---FUNCTIONS---//

function createHtml() {

	// TODO: delegate relevant bits to modules, setupPanel methods

	document.write("<div class=\"all\" style=\"display: block;\">");

	document.write("		<div id=\"controls\">");
	document.write("			<h2>");
	document.write("				Current date: <span id=\"currentDate\"> 0 <\/span>");
	document.write("			<\/h2>");
	document
			.write("			<!-- 			<div id=\"wrapper\" style=\"display: block;\"> -->");
	document.write("			<div>");
	document.write("				<div id=\"playPause\"><\/div>");
	document.write("				<div id=\"timeSlider\"><\/div>");
	document.write("			<\/div>");
	document.write("		<\/div>");

	// ---SELECTORS AND CONTAINER---//

	document
			.write("		<div class=\"selectorsANDcontainer\" style=\"display: block;\">");

	// ---SELECTORS---//

	document.write("			<div class=\"selectors\" style=\"display: block;\">");

	document.write("				<div class=\"buttons\">");
	document.write("					<button data-zoom=\"+1\">Zoom In<\/button>");
	document.write("					<button data-zoom=\"-1\">Zoom Out<\/button>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Export<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<button id=\"saveSVG\">Save SVG<\/button>");
	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Toggle layer visibility<\/h2>");
	document.write("					<div id=\"layerVisibility\" class=\"panelcontent\">");

	// document.write(" <input type=\"checkbox\" id=\"labelsLayerCheckbox\">
	// Labels layer<br>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Points fixed color<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"pointFixedColor\">");
	document.write("						<\/select>");

	document.write("						<div id=\"pointFixedColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Points color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div id=\"pointStartColor\">");
	document.write("						<\/div>");
	//
	document.write("						<div id=\"pointEndColor\">");
	document.write("						<\/div>");

	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"pointColorAttribute\">");
	document.write("						<\/select>");

	document.write("						<div id=\"pointColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Points fixed radius<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	// document.write("						<div class=\"wrapper\">");
	// document.write("							<div id=\"pointFixedRadiusSlider\"><\/div>");
	// document.write("						<\/div>");

	// document.write("						<div class=\"wrapper\">");
document.write("<input id=\"pointFixedRadiusSlider\" type=\"range\" >");
// document.write("						<\/div>");


	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Points radius attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"pointRadiusAttribute\">");
	document.write("						<\/select>");

	document.write("						  <div id=\"pointRadiusLegend\"  ><\/div>  ");

	// document.write(" <div class=\"wrapper\">");
	// document.write(" <h4>Adjust<\/h4>");
	// document.write(" <div id=\"pointAreaMultiplierSlider\"><\/div>");
	// document.write(" <\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Lines fixed color<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"lineFixedColor\">");
	document.write("						<\/select>");

	document.write("						<div id=\"lineFixedColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Lines color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div id=\"lineStartColor\">");
	document.write("						<\/div>");

	document.write("						<div id=\"lineEndColor\">");
	document.write("						<\/div>");

	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"lineColorAttribute\">");
	document.write("						<\/select>");

	document.write("						<div id=\"lineColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("                <div class=\"panelcollapsed\">");
	document.write("                    <h2>Lines opacity<\/h2>");
	document.write("                    <div class=\"panelcontent\">");

	document.write("                        <div class=\"wrapper\">");
	document
			.write("                            <div id=\"lineFixedOpacitySlider\"><\/div>");
	document.write("                        <\/div>");

	document.write("                    <\/div>");
	document.write("                <\/div>");

	// TODO : curvature
	// document.write(" <div class=\"panelcollapsed\">");
	// document.write(" <h2>Lines curvature<\/h2>");
	// document.write(" <div class=\"panelcontent\">");
	// document.write("");
	// document.write(" <div class=\"wrapper\">");
	// document.write(" <div id=\"maxCurvatureSlider\"><\/div>");
	// document.write(" <\/div>");
	// document.write("");
	// document.write(" <\/div>");
	// document.write(" <\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Lines width<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"lineWidthSlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Lines cut-off<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<select id=\"lineCutoffAttribute\">");
	document.write("						<\/select>");

	document.write("						<\/br>");
	document.write("						<\/br>");
	document.write("						<\/br>");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"lineCutoffSlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Polygons fixed color<\/h2>");

	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"areaFixedColor\">");
	document.write("						<\/select>");

	document.write("						<div id=\"areaFixedColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Polygons color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div id='areaStartColor'>");
	// document.write(" <h4>Start color<\/h4>");
	// document.write(" <input class='areaStartColor' \/>");
	document.write("						<\/div>");

	document.write("						<div id='areaEndColor'>");
	// document.write(" <h4>End color<\/h4>");
	// document.write(" <input class='areaEndColor' \/>");
	document.write("						<\/div>");

	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"areaColorAttribute\">");
	document.write("						<\/select>");

	document.write("						<div id=\"areaColorLegend\" ><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Polygons opacity<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"areaFixedOpacitySlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");


	 document.write(" <div class=\"panelcollapsed\">");
	 document.write(" <h2>Labels color<\/h2>");
	 document.write(" <div class=\"panelcontent\">");
	 document.write(" <select id=\"labelcolor\">");
	 document.write(" <\/select>");
	 document.write(" <div id=\"labelColorLegend\"><\/div>");
	 document.write(" <\/div>");
	 document.write(" <\/div>");


	document.write(" <div class=\"panelcollapsed\">");
	document.write(" <h2>Counts fixed color<\/h2>");
	document.write(" <div class=\"panelcontent\">");
	document.write(" <select id=\"countFixedColor\">");
	document.write(" <\/select>");
	document
			.write(" <div id=\"countFixedColorLegend\"><\/div>");
	document.write(" <\/div>");
	document.write(" <\/div>");

	 document.write(" <div class=\"panelcollapsed\">");
	 document.write(" <h2>Counts opacity<\/h2>");
	 document.write(" <div class=\"panelcontent\">");
	 document.write(" <div class=\"wrapper\">");
	 document.write(" <div id=\"countFixedOpacitySlider\"><\/div>");
	 document.write(" <\/div>");
	 document.write(" <\/div>");
	 document.write(" <\/div>");



	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Map color<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"mapFixedColor\">");
	document.write("						<\/select>");

	document.write("						<div id=\"mapFixedColorLegend\" ><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Map color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div id='mapStartColor'>");
	// document.write(" <h4>Start color<\/h4>");
	// document.write(" <input class='mapStartFill' \/>");
	document.write("						<\/div>");

	document.write("						<div id='mapEndColor'>");
	// document.write(" <h4>End color<\/h4>");
	// document.write(" <input class='mapEndFill' \/>");
	document.write("						<\/div>");

	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"mapColorAttribute\">");
	document.write("						<\/select>");

	document.write("						<div id=\"mapColorLegend\"><\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Map fixed opacity<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"mapFixedOpacitySlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Background color<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<select id=\"mapbackground\">");
	document.write("						<\/select>");

	document
			.write("						<div id=\"mapBackgroundLegend\" class=\"legend\"><\/div>");
	document.write("					<\/div>");
	document.write("				<\/div>");


	document.write("			<\/div>");
	// ---END: SELECTORS ---//

	document.write("			<div class=\"container\" id=\"container\"><\/div>");

	document.write("		<\/div>");
	// ---END: SELECTORS AND CONTAINER---//

	document.write("	<\/div>");
	// ---END: ALL---//

}// END: createDivs

function move() {

	var t = d3.event.translate;
	var s = d3.event.scale;
	var h = global.height / 4;

	t[0] = Math.min((global.width / global.height) * (s - 1), Math.max(
			global.width * (1 - s), t[0]));

	t[1] = Math.min(h * (s - 1) + h * s, Math.max(global.height * (1 - s) - h
			* s, t[1]));

	zoom.translate(t);
	global.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

	// fit the paths to the zoom level
	// d3.selectAll(".country").attr("stroke-width", 1.0 / s);
//	 d3.selectAll(".line").attr("stroke-width", lines.lineWidth / s);
	// d3.selectAll(".point").attr("stroke-width", 1.0 / s);

}// END: move

function render() {

	// TODO: serve json file statically
	// http://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack
	var json = require("./H3N2.json");

	var timeLine = json.timeLine;
	if (!(typeof timeLine === 'undefined')) {
		time.initializeTimeSlider(timeLine);
	} else {
		global.hasTime = false;
	}

	var layers = json.layers;
	var axisAttributes = json.axisAttributes;
	var nodeAttributes = json.pointAttributes;
	var lineAttributes = json.lineAttributes;
	var areaAttributes = json.areaAttributes;
	var mapAttributes = json.mapAttributes;
	var locations_ = json.locations;

	// ---MAP LAYER

	var mapRendered = false;
	layers.forEach(function(layer) {

		var type = layer.type;
		if (type == MAP) {

			var geojson = layer.geojson;
			topo.generateTopoLayer(geojson);

			topo.setupPanels(mapAttributes);

			mapRendered = true;

		}// END: MAP check

	});

	if (!mapRendered) {
		topo.generateEmptyTopoLayer(nodeAttributes, axisAttributes);
	}

	layers.forEach(function(layer) {

		var type = layer.type;
		if (type == COUNTS) {

			var countAttribute = utils.getObject(nodeAttributes, "id", COUNT);
			var counts_ = layer.points;

			if (counts_.length > 0) {
				counts.generateCountsLayer(counts_, countAttribute);
				counts.setupPanels(countAttribute);
				global.hasCounts = true;
			} else {
				global.hasCounts = false;
			}

		}// END: COUNTS check

	});

	layers.forEach(function(layer) {

		var type = layer.type;
		if (type == TREE) {

			var nodes = layer.points;
			var branches = layer.lines;
			var areas_ = layer.areas;

			if (!(typeof areas_ === 'undefined')) {
				areas.generateAreasLayer(areas_, areaAttributes);
				areas.setupPanels(areaAttributes);
				global.hasAreas = true;
			} else {
				global.hasAreas = false;
			}

			if (!(typeof branches === 'undefined')) {
				lines.generateLinesLayer(branches, nodes, lineAttributes);
				lines.setupPanels(lineAttributes);
				global.hasLines = true;
			} else {
				global.hasLines = false;
			}

			if (!(typeof nodes === 'undefined')) {
				points.generatePointsLayer(nodes, nodeAttributes);
				points.setupPanels(nodeAttributes);
				global.hasPoints = true;
			} else {
				global.hasPoints = false;
			}

		}// END: TREE check

	});

	if (!(typeof locations_ === 'undefined')) {

		locations.generateLocationsLayer(locations_);
		locations.generateLabels(locations_);
		locations.setupPanels( );
		global.hasLocations = true;

	} else {
		global.hasLocations = false;
	}

}// END: render


function setupPanels() {

	setupSaveSVGButton();
	setupZoomButtons();

}//END: setupPanels

function setupSaveSVGButton() {
	var saveSVGButton = document.getElementById("saveSVG");
	d3.select(saveSVGButton).on('click', function() {

		var tmp = document.getElementById("container");
		var svg = tmp.getElementsByTagName("svg")[0];

		// Extract the data as SVG text string
		var svg_xml = (new XMLSerializer).serializeToString(svg);

		window.open().document.write(svg_xml);

	});

}//END:setupSaveSVGButton

function setupZoomButtons() {

	d3.selectAll("button[data-zoom]").on("click", clicked);

}//END:setupZoomButtons

function clicked() {
	svg.call(zoom.event);

	var center0 = zoom.center();
	var translate0 = zoom.translate();
	var coordinates0 = coordinates(center0);

	// console.log(zoom.scale());

	zoom.scale(zoom.scale() * Math.pow(1.5, +this.getAttribute("data-zoom")));

	if (zoom.scale() < global.minScaleExtent) {
		zoom.scale(global.minScaleExtent);
	}

	if (zoom.scale() > global.maxScaleExtent) {
		zoom.scale(global.maxScaleExtent);
	}

	// Translate back to the center.
	var center1 = point(coordinates0);
	zoom.translate([ translate0[0] + center0[0] - center1[0],
			translate0[1] + center0[1] - center1[1] ]);

	svg.transition().duration(750).call(zoom.event);
}

function coordinates(point) {
	var scale = zoom.scale(), translate = zoom.translate();
	return [ (point[0] - translate[0]) / scale,
			(point[1] - translate[1]) / scale ];
}

function point(coordinates) {
	var scale = zoom.scale(), translate = zoom.translate();
	return [ coordinates[0] * scale + translate[0],
			coordinates[1] * scale + translate[1] ];
}

// ---CALLS---//

setupPanels();
render();
// collapsible.collapseAll();

console.log("Done!");
