/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("script!kodama");
var d3 = require('d3');
require("script!./d3-legend.js");


var utils = require('./utils.js');
var global = require('./global.js');
//var colorlegend = require('./colorlegend.js');

// import("./jquery.simple-color.js");
require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//

var pointsLayer;

var pointDefaultColorIndex = 6;
var pointStartColor = global.pairedSimpleColors[0];
var pointEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];

var point_fixed_radius = 2;
var min_point_radius = 1;
var max_point_radius = 7;

d3.kodama
		.themeRegistry(
				'nodesTheme',
				{
					frame : {
						padding : '4px',
						background : 'linear-gradient(to top, rgb(177, 68, 68) 0%, rgb(188, 95, 95) 90%)',
						'font-family' : '"Helvetica Neue", Helvetica, Arial, sans-serif',
						'border' : '1px solid rgb(57, 208, 204)',
						color : 'rgb(245,240,220)',
						'border-radius' : '4px',
						'font-size' : '12px',
						'box-shadow' : '0px 1px 3px rgba(0,20,40,.5)'
					},
					title : {
						'text-align' : 'center',
						'padding' : '4px'
					},
					item_title : {
						'text-align' : 'right',
						'color' : 'rgb(220,200,120)'
					},
					item_value : {
						'padding' : '1px 2px 1px 10px',
						'color' : 'rgb(234, 224, 184)'
					}
				});

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generatePointsLayer = function(nodes, nodeAttributes) {

	// color
	var colorAttribute = utils.getObject(nodeAttributes, "id", "lineage");

	var h3cols = [ "#D6D6E2", "#65658F", "#59A5BF", "#ECE5BD", "#D2C161",
			"#CAE2EB" ];
	var h1cols = [ "#CD322E", "#D6D6E2", "#2481BA", "#89A24C", "#835B9C" ];
	var colorscale = d3.scale.ordinal().range(h1cols).domain(
			colorAttribute.domain);

	// size
	var sizeAttribute = utils.getObject(nodeAttributes, "id", "antigenic3");

	var sizeScale = d3.scale.linear().domain(sizeAttribute.range).range(
			[ 7, 1 ]);

	pointsLayer = global.g.append("g").attr("class", "pointsLayer");

	var points = pointsLayer.selectAll("circle").data(nodes).enter().append(
			"circle") //
	.attr("class", "point") //
	.attr("startTime", function(d) {

		return (d.startTime);

	}) //
	.attr(
			"cx",
			function(d) {

				var xy;
				var location = d.location;
				if (typeof location != 'undefined') {

					xy = projection([ location.coordinate.yCoordinate,
							location.coordinate.xCoordinate ]);

				} else {

					xy = projection([ d.coordinate.yCoordinate,
							d.coordinate.xCoordinate ]);

				}

				var cx = xy[0]; // lat
				return (cx);
			}) //
	.attr(
			"cy",
			function(d) {

				var xy;
				var location = d.location;
				if (typeof location != 'undefined') {

					xy = projection([ location.coordinate.yCoordinate,
							location.coordinate.xCoordinate ]);

				} else {

					xy = projection([ d.coordinate.yCoordinate,
							d.coordinate.xCoordinate ]);

				}

				var cy = xy[1]; // long
				return (cy);
			}) //
	.attr("r", function(d) {

		return (sizeScale(+d.attributes.antigenic3));

	}) //
	.attr("fill", function(d) {

		if (typeof (d.attributes.lineage) == "undefined") {
			return ("grey");
		}

		return (colorscale(d.attributes.lineage));

	}) //
	.attr("stroke", "black") //
	.attr("opacity", 1.0).on('mouseover', function(d) {

		var point = d3.select(this);
		point.attr('stroke', 'white');

	}) //
	.on('mouseout', function(d, i) {

		var point = d3.select(this);
		point.attr('stroke', "black");

	}) //
	.call(d3.kodama.tooltip().format(function(d, i) {

		// TODO: display attibute values used for visualisation

		return {
			title : d.attributes.nodeName,
			items : [
			// {
			// title : 'Antigenic1',
			// value : (d.attributes.antigenic1).toFixed(2)
			// }, //
			// {
			// title : 'Antigenic2',
			// value : (d.attributes.antigenic2).toFixed(2)
			// }, {
			// title : 'Antigenic3',
			// value : (d.attributes.antigenic3).toFixed(2)
			// },//
			//
			// {
			// title : 'Lineage',
			// value : d.attributes.lineage
			// }

			]
		};

	}).theme('nodesTheme') //
	);

	// dump attribute values into DOM
	points[0].forEach(function(d, i) {

		var thisPoint = d3.select(d);
		var properties = nodes[i].attributes;

		for ( var property in properties) {
			if (properties.hasOwnProperty(property)) {

				thisPoint.attr(property, properties[property]);

			}
		}// END: properties loop
	});

}// END: generatePointsLayer

exports.setupPanels = function(attributes) {

	setupPointFixedColorPanel(attributes);
	setupPointColorAttributePanel(attributes);
	setupPointFixedRadiusPanel(attributes);
	setupPointRadiusAttributePanel(attributes);
	
}// END: setupPanels

exports.updatePointsLayer = function(value) {

	// ---select points yet to be displayed---//

	pointsLayer.selectAll(".point") //
	.filter(
			function(d) {
				var point = this;
				var startDate = utils
						.formDate(point.attributes.startTime.value).getTime();

				return (value < startDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "hidden").attr("opacity", 0);

	// ---select points displayed now---//

	pointsLayer.selectAll(".point") //
	.filter(
			function(d) {
				var point = this;
				var startDate = utils
						.formDate(point.attributes.startTime.value).getTime();

				return (value >= startDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr("visibility", "visible") //
	.attr("opacity", 1);

}// END: updatePointsLayer

// ---MODULE PRIVATE FUNCTIONS---//

updatePointColorLegend = function(scale) {

	var width = 150;
	var height = 110;
	
	var margin = {
		left : 20,
		top : 20
	};
	
	$('#pointColorLegend').html('');
	var svg = d3.select("#pointColorLegend").append('svg').attr("width", width).attr("height", height);
	
	var pointColorLegend = d3.legend.color()
			  .scale(scale)
			     .shape('circle')
		.shapeRadius(5)
		.shapePadding(10)
		    .cells(5)
		  .orient('vertical')
	
	svg.append("g")
	  .attr("class", "pointColorLegend")
	.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")") .call(pointColorLegend);


}// END: updateColorScale

updatePointColors = function(scale, colorAttribute) {

	pointsLayer.selectAll(".point").transition() //
	.ease("linear") //
	.attr("fill", function() {

		var point = d3.select(this);
		var attributeValue = point.attr(colorAttribute);
		var color = scale(attributeValue);

		if (attributeValue == null) {
			console.log("null found");
			color = "#000";
		}

		return (color);
	});

}// END: updatePointColors


updatePointFixedColorLegend = function(scale) {
	
	var width = 150;
	var height = 265;
	
	var margin = {
		left : 20,
		top : 20
	};
	
	$('#pointFixedColorLegend').html('');
	var svg = d3.select("#pointFixedColorLegend").append('svg').attr("width", width).attr("height", height);
	
	var pointFixedColorLegend = d3.legend.color()
			  .scale(scale)
			     .shape('circle')
		.shapeRadius(5)
		.shapePadding(10)
		    .cells(5)
		  .orient('vertical')
	
	svg.append("g")
	  .attr("class", "pointFixedColorLegend")
	.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")") .call(pointFixedColorLegend);
	
}//END: updatePointFixedColorLegend

setupPointFixedColorPanel = function(attributes) {

	var pointFixedColorSelect = document.getElementById("pointFixedColor");
	var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
			global.fixedColors);

	for (var i = 0; i < global.fixedColors.length; i++) {

		var option = global.fixedColors[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	pointFixedColorSelect.selectedIndex = pointDefaultColorIndex;

	// point fixed color listener
	d3
			.select(pointFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = pointFixedColorSelect.options[pointFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						pointsLayer.selectAll(".point") //
						.transition() //
						.ease("linear") //
						.attr("fill", color);

						// setup legend
						updatePointFixedColorLegend(scale);	
						
					});

}// END: setupFixedColorPanel

setupPointColorAttributePanel = function(attributes) {

	// attribute
	var pointColorAttributeSelect = document
			.getElementById("pointColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		option = attributes[i].id;
		// skip points with count attribute
		if (option == global.COUNT) {
			continue;
		}

		element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointColorAttributeSelect.appendChild(element);

	}// END: i loop

	// point color attribute listener
	d3
			.select(pointColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = pointColorAttributeSelect.options[pointColorAttributeSelect.selectedIndex].text;
						var attribute = utils.getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#pointStartColor').html('');
						$('#pointEndColor').html('');

						if (attribute.scale == global.ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.ordinal().range(
									global.ordinalColors).domain(data);

							updatePointColorLegend(scale );

						} else if (attribute.scale == global.LINEAR) {

							data = attribute.range;

							scale = d3.scale.linear().domain(data).range(
									[ pointStartColor, pointEndColor ]);

							updatePointColorLegend(scale );

							// start color
							$('#pointStartColor').html("<h4>Start color<\/h4>");
							$('#pointStartColor').append(
									"<input class=\"pointStartColor\" \/>");

							$('.pointStartColor')
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

													pointStartColor = "#" + hex;
													scale.range([
															pointStartColor,
															pointEndColor ]);
													updatePointColorLegend(
															scale );

													// trigger repaint
													updatePointColors(scale );

												}// END: onSelect
											});

							$('.pointStartColor').setColor(pointStartColor);

							// end color
							$('#pointEndColor').html("<h4>End color<\/h4>");
							$('#pointEndColor').append(
									"<input class=\"pointEndColor\" \/>");

							$('.pointEndColor')
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

													pointEndColor = "#" + hex;
													scale.range([
															pointStartColor,
															pointEndColor ]);
													updatePointColorLegend(
															scale );

													// trigger repaint
													updatePointColors(scale,
															colorAttribute);
												}
											});

							$('.pointEndColor').setColor(pointEndColor);

						} else {
							console
									.log("Error occured when resolving scale type!");
						}

						// trigger repaint
						updatePointColors(scale, colorAttribute);

					});

} // END: setupPointColorAttributePanel

setupPointFixedRadiusPanel = function(attributes) {

	var step = 1;
	
	var pointFixedRadiusSlider = d3.slider().axis(d3.svg.axis().orient("top").ticks( (max_point_radius -min_point_radius)/step  ))
			.min(min_point_radius).max(max_point_radius).step(1)
			.value(point_fixed_radius);

	d3.select('#pointFixedRadiusSlider').call(pointFixedRadiusSlider);

	// point fixed area listener
	pointFixedRadiusSlider.on("slide", function(evt, value) {

		point_fixed_radius = value;

		pointsLayer.selectAll(".point")//
		.transition()//
		.ease("linear") //
		.attr("r", point_fixed_radius);

	});

}// END: setupPointFixedAreaPanel


setupPointRadiusAttributePanel = function(attributes) {

	
	var pointRadiusAttributeSelect = document.getElementById("pointRadiusAttribute");

	for (var i = 0; i < attributes.length; i++) {

		var option = attributes[i].id;
		// skip points with count attribute
		if (option == global.COUNT) {
			continue;
		}

		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		pointRadiusAttributeSelect.appendChild(element);

	}// END: i loop
	

		// point area attribute listener
	d3
			.select(pointRadiusAttributeSelect)
			.on(
					'change',
					function() {

						var radiusAttribute = pointRadiusAttributeSelect.options[pointRadiusAttributeSelect.selectedIndex].text;
						var attribute = utils.getObject(attributes, "id",
								radiusAttribute);

						var data;
						var scale;

						if (attribute.scale == global.ORDINAL) {

							data = attribute.domain;
							
							// smart range
							var range = Array.apply(0, Array(data.length)).map(function (x, y) { return y + 1; });
							scale = d3.scale.ordinal().domain(data).range(range);

							updatePointRadiusLegend(scale );
							
						} else if (attribute.scale == global.LINEAR) {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ min_point_radius, max_point_radius ]);

							updatePointRadiusLegend(scale );
							
						} else {
							console
									.log("Error occured when resolving point radius scale type!");
						}

						pointsLayer
								.selectAll(".point")
								.transition()
								.ease("linear")
								.attr(
										"r",
										function(d) {

											var attributeValue = d.attributes[radiusAttribute];
											var radius = scale(attributeValue);

											if (attributeValue == null) {
												console
														.log("null point radius attribute value found");
												radius = 0.0;
											}

											return (radius);
										});
					});
	
	
	
	
}// END: setupPointAreaAttributePanel

updatePointRadiusLegend = function(scale) {

	var width = 150;
	var height = 200;
	
	var margin = {
		left : 20,
		top : 20
	};
	
	$('#pointRadiusLegend').html('');
	var svg = d3.select("#pointRadiusLegend").append('svg').attr("width", width).attr("height", height);
	
	var pointRadiusLegend = d3.legend.size()
	  .scale(scale)
	  .shape('circle')
	  .shapePadding(15)
	  .labelOffset(20)
	  .orient('vertical');
//	  .title(capitalizeFirstLetter(sizeAttribute.id));
	
	svg.append("g")
	  .attr("class", "pointRadiusLegend")
	.attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")") .call(pointRadiusLegend);
	
}//END: updatePointRadiusLegend