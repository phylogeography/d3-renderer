/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var locationsLayer;
var locationsColors =  [ "#000000", "#ffffff" ]
var locationsColorIndex = 0;




// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateLocationsLayer = function(locations_) {

	locationsLayer = global.g.append("g").attr("class", "locationsLayer");

	var locations = locationsLayer.selectAll("circle").data(locations_).enter()
			.append("circle") //
			.attr("class", "location") //
			.attr("cx", function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
				d.coordinate.yCoordinate // lat
				]);

				var cx = xy[0]; // long

				return (cx);
			}) //
			.attr("cy", function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
				d.coordinate.yCoordinate // lat
				]);

				var cy = xy[1]; // lat

				return (cy);
			}) //
			.attr("r", ".1px") //
			.attr("fill", locationsColors[locationsColorIndex]) //
			.attr("stroke", "black");

}// END: generateLocationsLayer

exports.generateLabels = function(locations_) {

	var labels = locationsLayer.selectAll("text").data(locations_).enter().append("text") //
	.attr("class", "label") //
	.attr(
			"x",
			function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
						d.coordinate.yCoordinate // lat
						]);
				
				var x = xy[0]; // long

				return (x);
			}) //
	.attr(
			"y",
			function(d) {

				var xy = global.projection([ d.coordinate.xCoordinate, // long
						d.coordinate.yCoordinate // lat
						]);
				
				var y = xy[1]; // lat

				return (y);
			}) //
	.text(function(d) {
		
		return (d.id);
	}) //
	.attr("font-family", "sans-serif")//
	.attr("font-size", "10px")//
	.attr("fill", "black") //
	;

}// END: generateLocationsLayer

exports.setupPanels = function() {
	
	setupLocationsLayerCheckbox();
	setupLocationsFixedColorPanel();
	
}//END: setupPanels

function setupLocationsLayerCheckbox() {

	$('#layerVisibility')
	.append(
			"<input type=\"checkbox\" id=\"locationsLayerCheckbox\"> Locations layer<br>");
	
	var locationsLayerCheckbox = document.getElementById("locationsLayerCheckbox");
	// default state is checked
	locationsLayerCheckbox.checked = true;

	d3.select(locationsLayerCheckbox).on("change", function() {

		var visibility = this.checked ? "visible" : "hidden";
		locationsLayer.selectAll("text").style("visibility", visibility);
		locationsLayer.selectAll("circle").style("visibility", visibility);
		
	});
	
	
}//END: setupLocationsLayerCheckbox

function setupLocationsFixedColorPanel() {

	var labelColorSelect = document.getElementById("labelcolor");

	var domain = [ "black", "white" ];
	var scale = utils.alternatingColorScale().domain(domain).range(
			locationsColors);

	for (var i = 0; i < domain.length; i++) {

		var option = domain[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		labelColorSelect.appendChild(element);

	}// END: i loop
	
	// select the default
	labelColorSelect.selectedIndex = locationsColorIndex;
	
	
	// label color listener
	d3
			.select(labelColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = labelColorSelect.options[labelColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						d3.selectAll(".label") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

						// setup legend
						updateLocationsFixedColorLegend(scale);
						
					});
	
	
}//END: setupLocationsFixedColorPanel
	
function updateLocationsFixedColorLegend(scale) {

	var width = 150;
	var height = 50;

	var margin = {
		left : 20,
		top : 20
	};

	$('#labelColorLegend').html('');
	var svg = d3.select("#labelColorLegend").append('svg').attr("width",
			width).attr("height", height);

	var labelColorLegend = d3.legend.color().scale(scale).shape('circle')
			.shapeRadius(5).shapePadding(10).cells(locationsColors.length).orient('vertical')

	svg.append("g").attr("class", "labelColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
					labelColorLegend);
	
	
}//END:updateLocationsFixedColorLegend

