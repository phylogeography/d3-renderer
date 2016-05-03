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

// ---MODULE VARIABLES---//

var zoom = d3.behavior.zoom().scaleExtent(
  [global.minScaleExtent, global.maxScaleExtent]).center(
  [global.width / 2, global.height / 2]).size(
  [global.width, global.height]).on("zoom", move);

var svg = d3.select(".container").append('svg') //
.attr("class", "svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + global.width + " " + global.height)
  .call(zoom);

global.g = svg.append("g");

var MAP = "map";
var TREE = "tree";
var COUNTS = "counts";
var COUNT = "count";

// ---FUNCTIONS---//

function createHtml() {

  document.write("<div class=\"all\" style=\"display: block;\">");

  document.write("		<div id=\"controls\">");
  document.write("			<h2>");
  document.write("				Current date: <span id=\"currentDate\"> 0 <\/span>");
  document.write("			<\/h2>");

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

  document.write("			<\/div>");
  // ---END: SELECTORS ---//

  document.write("			<div class=\"container\" id=\"container\"><\/div>");

  document.write("		<\/div>");
  // ---END: SELECTORS AND CONTAINER---//

  document.write("	<\/div>");
  // ---END: ALL---//

} // END: createDivs

function move() {

  var t = d3.event.translate;
  var s = d3.event.scale;
  var h = global.height / 4;

  t[0] = Math.min((global.width / global.height) * (s - 1), Math.max(
    global.width * (1 - s), t[0]));

  t[1] = Math.min(h * (s - 1) + h * s, Math.max(global.height * (1 - s) - h * s, t[1]));

  zoom.translate(t);
  global.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  // fit the paths to the zoom level
  // d3.selectAll(".country").attr("stroke-width", 1.0 / s);
  // d3.selectAll(".line").attr("stroke-width", lines.lineWidth / s);
  d3.selectAll(".point").attr("stroke-width", 1.0 / s);
} // END: move

function render() {

  d3.json("ebov.json", function(error, json) {

    if (error) {
      return console.warn(error);
    }

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

      } // END: MAP check

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
          counts.generateCountsLayer(counts_, locations_, countAttribute);
          counts.setupPanels(countAttribute);
          global.hasCounts = true;
        } else {
          global.hasCounts = false;
        }

      } // END: COUNTS check

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
          lines.generateLinesLayer(branches, nodes, locations_, lineAttributes);
          lines.setupPanels(lineAttributes);
          global.hasLines = true;
        } else {
          global.hasLines = false;
        }

        if (!(typeof nodes === 'undefined')) {
          points.generatePointsLayer(nodes, locations_, nodeAttributes);
          points.setupPanels(nodeAttributes);
          global.hasPoints = true;
        } else {
          global.hasPoints = false;
        }

      } // END: TREE check

    });

    if (!(typeof locations_ === 'undefined')) {

      locations.generateLocationsLayer(locations_);
      locations.generateLabels(locations_);
      locations.setupPanels();
      global.hasLocations = true;

    } else {
      global.hasLocations = false;
    }

  });

} // END: render

function setupPanels() {
  setupZoomButtons();
  setupSaveSVGButton();
  setupToggleLayerVisibility();
} //END: setupPanels

function setupToggleLayerVisibility() {

	var str =("				<div class=\"panelcollapsed\">")+
  ("					<h2>Toggle layer visibility<\/h2>") +
   ("					<div id=\"layerVisibility\" class=\"panelcontent\">") +
 ("					<\/div>") +
 ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

}//END:setupToggleLayerVisibility

function setupSaveSVGButton() {

  var str = ("				<div class=\"panelcollapsed\">") +
    ("					<h2>Export<\/h2>") +
    ("					<div class=\"panelcontent\">") +
    ("						<button id=\"saveSVG\">Save SVG<\/button>") +
    ("					<\/div>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  var saveSVGButton = document.getElementById("saveSVG");
  d3.select(saveSVGButton).on('click', function() {

    var tmp = document.getElementById("container");
    var svg = tmp.getElementsByTagName("svg")[0];

    // Extract the data as SVG text string
    var svg_xml = (new XMLSerializer).serializeToString(svg);

    window.open().document.write(svg_xml);

  });

} //END:setupSaveSVGButton

function setupZoomButtons() {
// not exacly JSX :)
  var str = ("				<div class=\"buttons\">") +
    ("					<button data-zoom=\"+1\">Zoom In<\/button>") +
    ("					<button data-zoom=\"-1\">Zoom Out<\/button>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  d3.selectAll("button[data-zoom]").on("click", clicked);

} //END:setupZoomButtons

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
  zoom.translate([translate0[0] + center0[0] - center1[0],
    translate0[1] + center0[1] - center1[1]
  ]);

  svg.transition().duration(750).call(zoom.event);
}

function coordinates(point) {
  var scale = zoom.scale(),
    translate = zoom.translate();
  return [(point[0] - translate[0]) / scale,
    (point[1] - translate[1]) / scale
  ];
}

function point(coordinates) {
  var scale = zoom.scale(),
    translate = zoom.translate();
  return [coordinates[0] * scale + translate[0],
    coordinates[1] * scale + translate[1]
  ];
}

// ---CALLS---//

setupPanels();
render();

collapsible.setUpPanels();
collapsible.collapseAll();
// collapsible.expandAll();

console.log("Done!");
