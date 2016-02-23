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
   
	// TODO: delegate relevant bits to modules, setupPanel methods
	
	document.write("<div class=\"all\" style=\"display: block;\">");

	
	document.write("		<div id=\"controls\">");
	document.write("			<h2>");
	document.write("				Current date: <span id=\"currentDate\"> 0 <\/span>");
	document.write("			<\/h2>");
	document.write("			<!-- 			<div id=\"wrapper\" style=\"display: block;\"> -->");
	document.write("			<div>");
	document.write("				<div id=\"playPause\"><\/div>");
	document.write("				<div id=\"timeSlider\"><\/div>");
	document.write("			<\/div>");
	document.write("		<\/div>");

	//---SELECTORS AND CONTAINER---//
	
	document.write("		<div class=\"selectorsANDcontainer\" style=\"display: block;\">");

	//---SELECTORS---//
	
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
	document.write("					<div class=\"panelcontent\">");
	
	document.write("						<input type=\"checkbox\" id=\"mapLayerCheckbox\"> Map layer<br>");
	document.write("                        <input type=\"checkbox\" id=\"pointsLayerCheckbox\"> Points layer<br>");
	document.write("						<input type=\"checkbox\" id=\"labelsLayerCheckbox\"> Labels layer<br>");
	document.write("						<input type=\"checkbox\" id=\"linesLayerCheckbox\"> Lines layer<br>");
	document.write("						<input type=\"checkbox\" id=\"areasLayerCheckbox\"> Polygons layer<br>");
	
	document.write("					<\/div>");
	document.write("				<\/div>");


	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Point fixed color<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"pointFixedColor\">");
	document.write("						<\/select>");

	document.write("						<div id=\"pointFixedColorLegend\"><\/div>");
//	document.write("						<div id=\"pointFixedColorLegend\" class=\"legend\"><\/div>");
	
	document.write("					<\/div>");
	document.write("				<\/div>");

	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Point color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	
	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"pointColorAttribute\">");
	document.write("						<\/select>");
	
	document.write("						<div id=\"pointColorLegend\"><\/div>");
//	document.write("						<div id=\"pointColorLegend\" class=\"legend\"><\/div>");
	
	document.write("						<div id=\"pointStartColor\">");
//	document.write("							<h4>Start color<\/h4>");
//	document.write("							<input class='pointStartColor' \/>");
	document.write("						<\/div>");
//	
	document.write("						<div id=\"pointEndColor\">");
//	document.write("							<h4>End color<\/h4>");
//	document.write("							<input class='pointEndColor' \/>");
	document.write("						<\/div>");
	
	document.write("					<\/div>");
	document.write("				<\/div>");

	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Point fixed radius<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"pointFixedRadiusSlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	
	
	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Point radius attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"pointRadiusAttribute\">");
	document.write("						<\/select>");
	
	document.write("						  <div id=\"pointRadiusLegend\"  ><\/div>  ");

//	document.write("						<div class=\"wrapper\">");
//	document.write("							<h4>Adjust<\/h4>");
//	document.write("							<div id=\"pointAreaMultiplierSlider\"><\/div>");
//	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");
	
	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Line fixed color<\/h2>");
	document.write("					<div class=\"panelcontent\">");
	document.write("						<select id=\"lineFixedColor\">");
	document.write("						<\/select>");
	
	document.write("						<div id=\"lineFixedColorLegend\"><\/div>");
	
	document.write("					<\/div>");
	document.write("				<\/div>");

	
	
		document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Line color attribute<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<h4>Attribute<\/h4>");
	document.write("						<select id=\"lineColorAttribute\">");
	document.write("						<\/select>");

	document.write("						<div id=\"lineColorLegend\"><\/div>");

	
	document.write("						<div id=\"lineStartColor\">");
//	document.write("							<h4>Start color<\/h4>");
//	document.write("							<input class='lineStartColor' \/>");
	document.write("						<\/div>");

	document.write("						<div id=\"lineEndColor\">");
//	document.write("							<h4>End color<\/h4>");
//	document.write("							<input class='lineEndColor' \/>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");

	
	
		document.write("                <div class=\"panelcollapsed\">");
	document.write("                    <h2>Line opacity<\/h2>");
	document.write("                    <div class=\"panelcontent\">");
	
	document.write("                        <div class=\"wrapper\">");
	document.write("                            <div id=\"lineFixedOpacitySlider\"><\/div>");
	document.write("                        <\/div>");

	document.write("                    <\/div>");
	document.write("                <\/div>");

	
	
	
	//TODO : curvature
	//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Line curvature<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div class=\"wrapper\">");
//	document.write("							<div id=\"maxCurvatureSlider\"><\/div>");
//	document.write("						<\/div>");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");

	
	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Line width<\/h2>");
	document.write("					<div class=\"panelcontent\">");

	document.write("						<div class=\"wrapper\">");
	document.write("							<div id=\"lineWidthSlider\"><\/div>");
	document.write("						<\/div>");

	document.write("					<\/div>");
	document.write("				<\/div>");
	
	
	document.write("				<div class=\"panelcollapsed\">");
	document.write("					<h2>Line cut-off<\/h2>");
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

	
	
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Polygon color<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("						<select id=\"areaFixedColor\">");
//	document.write("						<\/select>");
//	document.write("						<div id=\"areaFixedColorLegend\" class=\"legend\"><\/div>");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Polygon color attribute<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div>");
//	document.write("							<h4>Start color<\/h4>");
//	document.write("							<input class='areaStartColor' \/>");
//	document.write("						<\/div>");
//	document.write("");
//	document.write("						<div>");
//	document.write("							<h4>End color<\/h4>");
//	document.write("							<input class='areaEndColor' \/>");
//	document.write("						<\/div>");
//	document.write("");
//	document.write("						<h4>Attribute<\/h4>");
//	document.write("						<select id=\"areaColorAttribute\">");
//	document.write("						<\/select>");
//	document.write("");
//	document.write("						<div id=\"areaColorLegend\" class=\"legend\"><\/div>");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Polygon opacity<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div class=\"wrapper\">");
//	document.write("							<div id=\"areaFixedOpacitySlider\"><\/div>");
//	document.write("						<\/div>");
//	document.write("						<!-- END: wrapper-->");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Circular polygon color<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("						<select id=\"countFixedColor\">");
//	document.write("						<\/select>");
//	document.write("						<div id=\"countFixedColorLegend\" class=\"legend\"><\/div>");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Circular polygon opacity<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div class=\"wrapper\">");
//	document.write("							<div id=\"countFixedOpacitySlider\"><\/div>");
//	document.write("						<\/div>");
//	document.write("						<!-- END: wrapper-->");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Map fill<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("						<select id=\"mapFixedFill\">");
//	document.write("						<\/select>");
//	document.write("						<div id=\"mapFixedFillLegend\" class=\"legend\"><\/div>");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Map fill attribute<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div>");
//	document.write("							<h4>Start color<\/h4>");
//	document.write("							<input class='mapStartFill' \/>");
//	document.write("						<\/div>");
//	document.write("");
//	document.write("						<div>");
//	document.write("							<h4>End color<\/h4>");
//	document.write("							<input class='mapEndFill' \/>");
//	document.write("						<\/div>");
//	document.write("");
//	document.write("						<h4>Attribute<\/h4>");
//	document.write("						<select id=\"mapFillAttribute\">");
//	document.write("						<\/select>");
//	document.write("");
//	document.write("						<div id=\"mapFillLegend\" class=\"legend\"><\/div>");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Map fill opacity<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("");
//	document.write("						<div class=\"wrapper\">");
//	document.write("							<div id=\"mapFixedOpacitySlider\"><\/div>");
//	document.write("						<\/div>");
//	document.write("						<!-- END: wrapper-->");
//	document.write("");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Background color<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("						<select id=\"mapbackground\">");
//	document.write("						<\/select>");
//	document.write("						<div id=\"mapBackgroundLegend\" class=\"legend\"><\/div>");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
//	document.write("");
//	document.write("");
//	document.write("				<div class=\"panelcollapsed\">");
//	document.write("					<h2>Label color<\/h2>");
//	document.write("					<div class=\"panelcontent\">");
//	document.write("						<select id=\"labelcolor\">");
//	document.write("						<\/select>");
//	document.write("						<div id=\"labelColorLegend\" class=\"legend\"><\/div>");
//	document.write("					<\/div>");
//	document.write("				<\/div>");
//	document.write("				<!-- END: panel-->");
	document.write("");
	document.write("			<\/div>");
	document.write("			<!-- END: selectors-->");
	document.write("");
	document.write("			<div class=\"container\"><\/div>");
	document.write("");
	document.write("		<\/div>");
	document.write("		<!-- END: selectorsANDcontainer-->");
	document.write("");
	document.write("	<\/div>");
	
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

	// TODO: if has 
	points.setupPanels(nodeAttributes);
	lines.setupPanels(nodeAttributes);
	
}// END: render

// ---RENDERING---//


render();
//collapsible.collapseAll();

console.log("Done!");
