/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
var d3 = require('d3');
 require("script!./d3-legend.js");

var utils = require('./utils.js');
var global = require('./global.js');

// require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//

var areasLayer;

var areaDefaultColorIndex = 1;
var areaStartColor = global.pairedSimpleColors[0];
var areaEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];
var polygonOpacity = 0.3;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateAreasLayer = function(areas, areaAttributes) {

	areasLayer = global.g.append("g").attr("class", "areasLayer");

	var areas = areasLayer.selectAll("area").data(areas).enter().append(
			"polygon") //
	.attr("class", "area") //
	.attr("startTime", function(d) {

		return (d.startTime);

	}) //
	.attr("points", function(d) {

		var polygon = d.polygon;
		return polygon.coordinates.map(function(d) {

			xy = global.projection([ d.xCoordinate, // long
			d.yCoordinate // lat
			]);

			return [ xy[0], // long
			xy[1] // lat
			].join(",");

		}).join(" ");
	}) //
	.attr("fill", global.fixedColors[areaDefaultColorIndex]) //
	.attr("fill-opacity", polygonOpacity) //
	.attr("visibility", "visible") //
	.on('mouseover', function(d) {

		var area = d3.select(this);
		area.attr('stroke', '#000').attr("stroke-width", "0.5px") //

	}) //
	.on('mouseout', function(d, i) {

		var area = d3.select(this);
		area.attr('stroke', null).attr("stroke-width", null) //
	});

}// END: generateAreasLayer

exports.updateAreasLayer = function(value) {

	// ---select areas yet to be displayed---//

	areasLayer.selectAll(".area") //
	.filter(
			function(d) {
				var polygon = this;
				var startDate = utils.formDate(
						polygon.attributes.startTime.value).getTime();

				return (value < startDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "hidden");

	// ---select polygons displayed now---//

	areasLayer.selectAll(".area") //
	.filter(
			function(d) {
				var polygon = this;
				var startDate = utils.formDate(
						polygon.attributes.startTime.value).getTime();

				return (value >= startDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "visible");

}// END: updateAreasLayer

exports.setupPanels = function(attributes) {

	setupAreasLayerCheckbox();
	setupAreaFixedColorPanel();

}// END: setupPanels

setupAreaFixedColorPanel = function() {

	var areaFixedColorSelect = document.getElementById("areaFixedColor");
	var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
			global.fixedColors);

	for (var i = 0; i < global.fixedColors.length; i++) {

		var option = global.fixedColors[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		areaFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	areaFixedColorSelect.selectedIndex = areaDefaultColorIndex;

	// area fixed color listener
	d3
			.select(areaFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = areaFixedColorSelect.options[areaFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						areasLayer.selectAll(".area") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

						// setup legend
						updateAreaFixedColorLegend(scale);
						
					});
	
}// END: setupAreaFixedColorPanel


updateAreaFixedColorLegend = function(scale) {
	
	var width = 150;
	var height = 265;

	var margin = {
		left : 20,
		top : 20
	};

	$('#areaFixedColorLegend').html('');
	var svg = d3.select("#areaFixedColorLegend").append('svg').attr("width",
			width).attr("height", height);

	var areaFixedColorLegend = d3.legend.color().scale(scale).shape('circle')
			.shapeRadius(5).shapePadding(10).cells(5).orient('vertical')

	svg.append("g").attr("class", "areaFixedColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
					areaFixedColorLegend);
	
	
}//END: updateAreaFixedColorLegend

setupAreasLayerCheckbox = function() {

	$('#layerVisibility')
			.append(
					"<input type=\"checkbox\" id=\"areasLayerCheckbox\"> Polygons layer<br>");

	var areasLayerCheckbox = document.getElementById("areasLayerCheckbox");
	// default state is checked
	areasLayerCheckbox.checked = true;

	d3.select(areasLayerCheckbox).on("change", function() {

		if (this.checked) {
			// remove style, then visibility is driven by the time-based
			// selections
			areasLayer.selectAll(".area").style("visibility", null);
		} else {
			// style is superior to attribute, make them hidden
			areasLayer.selectAll(".area").style("visibility", "hidden");
		}

	});

}// END: setupAreasLayerCheckbox

// ---MODULE PRIVATE FUNCTIONS---//
