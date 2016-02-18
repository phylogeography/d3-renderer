/**
 * @fbielejec
 */

// ---NODE MODULES---//
require("./main.css");
var d3 = require('d3');
var time = require("./time.js");
var topo = require('./topo');

// ---HTML---//

createDivs();

// ---MODULE VARIABLES---//

var minScaleExtent = 1;
var maxScaleExtent = 5;

var margin = {
	top : 30,
	right : 50,
	bottom : 50,
	left : 200,
};

var width = 1100 - margin.left - margin.right;
var height = 1100 - margin.top - margin.bottom;


var zoom = d3.behavior.zoom().scaleExtent(
		[  minScaleExtent,  maxScaleExtent ]).center(
		[ width / 2, height / 2 ]).size([ width, height ]).on("zoom", move);

var svg = d3.select("#container").append('svg') //
.attr("width", width + margin.left + margin.right) //
.attr("height", height + margin.top + margin.bottom) //
.call(zoom);

var g = svg.append("g");

var xAxisLayer = g.append("g").attr("class", "x axis");
var yAxisLayer = g.append("g").attr("class", "y axis");

global.areasLayer = g.append("g").attr("class", "areasLayer");
global.linesLayer = g.append("g").attr("class", "linesLayer");
global.pointsLayer = g.append("g").attr("class", "pointsLayer");

// ---FUNCTIONS---//

function createDivs() {

	var controls = document.createElement('DIV');
	controls.setAttribute('id', "controls");

	var h2 = document.createElement("H2");
	var text = document.createTextNode("Current date:");
	h2.appendChild(text);

	var span = document.createElement('SPAN');
	span.setAttribute('id', "currentDate");
	h2.appendChild(span);

	controls.appendChild(h2);

	var wrapper = document.createElement('DIV');

	var playPause = document.createElement('DIV');
	playPause.setAttribute('id', "playPause");
	wrapper.appendChild(playPause);

	var timeSliderDiv = document.createElement('DIV');
	timeSliderDiv.setAttribute('id', "timeSlider");
	wrapper.appendChild(timeSliderDiv);

	controls.appendChild(wrapper);

	document.body.appendChild(controls);

	var container = document.createElement('DIV');
	container.setAttribute('id', "container");
	document.body.appendChild(container);

}// END: createDivs

function move() {

	var t = d3.event.translate;
	var s = d3.event.scale;
	var h = height / 4;

	t[0] = Math
			.min((width / height) * (s - 1), Math.max(width * (1 - s), t[0]));

	t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s,
			t[1]));

	zoom.translate(t);
	g.attr("transform", "translate(" + t + ")scale(" + s + ")");

	// fit the paths to the zoom level
	// d3.selectAll(".country").attr("stroke-width", 1.0 / s);
	// d3.selectAll(".line").attr("stroke-width", lineWidth / s);
	// d3.selectAll(".point").attr("stroke-width", 1.0 / s);

}// END: move

// TODO: serve json file statically
// http://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack

function render() {

	var json = require("./global_swine.H1.json");

//	lineAttributes = json.lineAttributes;
//	pointAttributes = json.pointAttributes;

	var timeLine = json.timeLine;
	time.initializeTimeSlider(timeLine);
	

	var pointAttributes = json.pointAttributes;
	var axisAttributes = json.axisAttributes;
	topo.generateEmptyTopoLayer(pointAttributes, axisAttributes);
	

}// END: render

// ---RENDERING---//

render();
console.log("Done!");
