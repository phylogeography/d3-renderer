/**
 * @fbielejec
 */

// ---NODE MODULES---//
require("./main.css");
var d3 = require('d3');
var global = require('./global.js');
var time = require("./time.js");
var topo = require('./topo.js');
var points = require('./points.js');
var lines = require('./lines.js');




// ---HTML---//

createDivs();

// ---MODULE VARIABLES---//

var zoom = d3.behavior.zoom().scaleExtent(
		[  global.minScaleExtent,  global.maxScaleExtent ]).center(
		[ global.width / 2, global.height / 2 ]).size([ global.width, global.height ]).on("zoom", move);

var svg = d3.select("#container").append('svg') //
.attr("width", global.width + global.margin.left + global.margin.right) //
.attr("height", global.height + global.margin.top + global.margin.bottom) //
.call(zoom);

global.g = svg.append("g");

//var g = svg.append("g");

//var xAxisLayer = g.append("g").attr("class", "x axis");
//var yAxisLayer = g.append("g").attr("class", "y axis");

//areasLayer = g.append("g").attr("class", "areasLayer");
//linesLayer = g.append("g").attr("class", "linesLayer");
//pointsLayer = g.append("g").attr("class", "pointsLayer");

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
	var h = global.height / 4;

	t[0] = Math
			.min((global.width / global.height) * (s - 1), Math.max(global.width * (1 - s), t[0]));

	t[1] = Math.min(h * (s - 1) + h * s, Math.max(global.height * (1 - s) - h * s,
			t[1]));

	zoom.translate(t);
	global.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

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
	

	var nodeAttributes = json.pointAttributes;
	var axisAttributes = json.axisAttributes;
	topo.generateEmptyTopoLayer(nodeAttributes, axisAttributes);
	
	var nodes = json.layers[0].points;
	points.generatePointsLayer(nodes, nodeAttributes);
	
	var branches = json.layers[0].lines;
	lines.generateLinesLayer(branches, nodes, nodeAttributes);
	
	
	
}// END: render

// ---RENDERING---//

render();
console.log("Done!");
