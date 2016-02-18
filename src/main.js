/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("./main.css");
var collapsible = require("./collapsible.js");
var d3 = require('d3');
var global = require('./global.js');
var time = require("./time.js");
var topo = require('./topo.js');
var points = require('./points.js');
var lines = require('./lines.js');

// ---HTML---//

createHtml();
collapsible.setUpPanels();
collapsible.collapseAll() ;
//require("script!./collapsible.js");

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

// areasLayer = g.append("g").attr("class", "areasLayer");

// ---FUNCTIONS---//

function createHtml() {

	var document = this.document;
	
	var all = document.createElement('DIV');
	all.setAttribute('id', "all");
	all.setAttribute('style', "display: block;");
	
	time.createHtml(document, all);
	
	// <div class="selectorsANDcontainer" style="display: block;">

	var selectorsANDcontainer = document.createElement('DIV');
	selectorsANDcontainer.setAttribute('id', "selectorsANDcontainer");
	selectorsANDcontainer.setAttribute('style', "display: block;");
	

//	<div class="selectors" style="display: block;">
	var selectors = document.createElement('DIV');
	selectors.setAttribute('class', "selectors");
	selectors.setAttribute('style', "display: block;");
	
	
	var buttons = document.createElement('DIV');
	buttons.setAttribute('class', "buttons");
	var button = document.createElement('BUTTON');
	button.setAttribute('data-zoom', "+1");
	var text = document.createTextNode("Zoom In");
	button.appendChild(text);
	buttons.appendChild(button);
	var button = document.createElement('BUTTON');
	button.setAttribute('data-zoom', "-1");
	var text = document.createTextNode("Zoom Out");
	button.appendChild(text);
	buttons.appendChild(button);
	selectors.appendChild(buttons);
	

	
//	<div class="panel">
//	<h2>Export</h2>
//	<div class="panelcontent">
//		<button id="saveSVG">Save SVG</button>
//	</div>
//</div>
	var panel = document.createElement('DIV');
	panel.setAttribute('class', "panel");
	var h2 = document.createElement("H2");
	var text = document.createTextNode("Export");
	h2.appendChild(text);
	panel.appendChild(h2);
	var panelcontent = document.createElement('DIV');
	panelcontent.setAttribute('class', "panelcontent");
	var button = document.createElement('BUTTON');
	button.setAttribute('id', "saveSVG");
	var text = document.createTextNode("Save SVG");
	button.appendChild(text);
	panelcontent.appendChild(button);
	panel.appendChild(panelcontent);
	selectors.appendChild(panel);
	
	
	
	selectorsANDcontainer.appendChild(selectors);
	
	///
	
	var container = document.createElement('DIV');
	container.setAttribute('class', "container");
	selectorsANDcontainer.appendChild(container);
	
	
	all.appendChild(selectorsANDcontainer);
	document.body.appendChild(all);
	
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
	// d3.selectAll(".line").attr("stroke-width", lineWidth / s);
	// d3.selectAll(".point").attr("stroke-width", 1.0 / s);

}// END: move

// TODO: serve json file statically
// http://stackoverflow.com/questions/27639005/how-to-copy-static-files-to-build-directory-with-webpack

function render() {

	var json = require("./global_swine.H1.json");

	var timeLine = json.timeLine;
	var nodes = json.layers[0].points;
	var branches = json.layers[0].lines;

	var axisAttributes = json.axisAttributes;
	var nodeAttributes = json.pointAttributes;
	// var lineAttributes = json.lineAttributes;

	time.initializeTimeSlider(timeLine);
	topo.generateEmptyTopoLayer(nodeAttributes, axisAttributes);
	lines.generateLinesLayer(branches, nodes, nodeAttributes);
	points.generatePointsLayer(nodes, nodeAttributes);

}// END: render

// ---RENDERING---//

render();
console.log("Done!");
