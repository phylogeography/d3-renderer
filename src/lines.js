/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
// require("script!kodama");
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var lineDefaultColorIndex = 12;
var lineStartColor = global.pairedSimpleColors[0];
var lineEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];
var lineWidth = 2;
var min_line_width = 0.5;
var max_line_width = 5;

var lineOpacity = 1.0;
var min_line_opacity = 0.3;
var max_line_opacity = 1;

var linesLayer;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateLinesLayer = function(branches, nodes, branchAttributes) {

	var colorAttribute = utils.getObject(branchAttributes, "id", "lineage");

	var h3cols = [ "#D6D6E2", "#65658F", "#59A5BF", "#ECE5BD", "#D2C161",
			"#CAE2EB" ];
	var h1cols = [ "#CD322E", "#D6D6E2", "#2481BA", "#89A24C", "#835B9C" ]; // =
	// colorbrewer.Dark2[8]
	var colorscale = d3.scale.ordinal().range(h1cols).domain(
			colorAttribute.domain);

	var opacityAttribute = utils.getObject(branchAttributes, "id", "height");

	var opacityscale = d3.scale.linear().domain(opacityAttribute.range).range(
			[ 0.5, 1 ]);

	linesLayer = global.g.append("g").attr("class", "linesLayer");

	var lines = linesLayer.selectAll("path").data(branches).enter().append(
			"path") //
	.attr("class", "line") //
	.attr(
			"d",
			function(d, i) {

				var line = d;

				var startPointId = line.startPointId;
				var startPoint = utils.getObject(nodes, "id", startPointId);
				line['startPoint'] = startPoint;

				var startCoordinate;
				var startLocation = startPoint.location;
				if (typeof startLocation != 'undefined') {

					startCoordinate = startLocation.coordinate;

				} else {

					startCoordinate = startPoint.coordinate;

				}

				var endPointId = line.endPointId;
				var endPoint = utils.getObject(nodes, "id", endPointId);
				line['endPoint'] = endPoint;

				var endCoordinate;
				var endLocation = endPoint.location;
				if (typeof startLocation != 'undefined') {

					endCoordinate = endLocation.coordinate;

				} else {

					endCoordinate = endPoint.coordinate;

				}
				// line['endCoordinate'] = endCoordinate;

				// line bend
				var curvature;
				var startTime = line.startTime;
				if (typeof startTime != "undefined") {

					curvature = 0;// scale(formDate(line.startTime));

				} else {
					curvature = 0;// lineMaxCurvature;

				}

				var startLatitude = startCoordinate.xCoordinate;
				var startLongitude = startCoordinate.yCoordinate;

				var endLatitude = endCoordinate.xCoordinate;
				var endLongitude = endCoordinate.yCoordinate;

				var sourceXY = projection([ startLongitude, startLatitude ]);
				var targetXY = projection([ endLongitude, endLatitude ]);

				var sourceX = sourceXY[0]; // lat
				var sourceY = sourceXY[1]; // long

				var targetX = targetXY[0];
				var targetY = targetXY[1];

				var dx = targetX - sourceX;
				var dy = targetY - sourceY;
				var dr = 0;

				// line['targetX'] = targetX;
				// line['targetY'] = targetY;
				// line['sourceX'] = sourceX;
				// line['sourceY'] = sourceY;

				var bearing = "M" + sourceX + "," + sourceY + "A" + dr + ","
						+ dr + " 0 0,1 " + targetX + "," + targetY;

				return (bearing);

			}) //
	.attr("fill", "none") //
	.attr("stroke-width", lineWidth + "px") //
	.attr("stroke-linejoin", "round") //
	.attr("stroke", function(d) {

		if (typeof (d.attributes.lineage) == "undefined") {
			return ("grey");
		}

		return (colorscale(d.attributes.lineage));
	}) //
	.attr("startTime", function(d) {
		return (d.startTime);
	}) //
	.attr("endTime", function(d) {
		return (d.endTime);
	}) //
	.attr("stroke-dasharray", function(d) {

		var totalLength = d3.select(this).node().getTotalLength();
		return (totalLength + " " + totalLength);
	}) //
	.attr("stroke-dashoffset", 0) //
	.attr("opacity", function(d) {

		return (opacityscale(+d.attributes.height));
	});

	// dump attribute values into DOM
	lines[0].forEach(function(d, i) {

		var thisLine = d3.select(d);
		var properties = branches[i].attributes;

		for ( var property in properties) {
			if (properties.hasOwnProperty(property)) {

				thisLine.attr(property, properties[property]);

			}
		}// END: properties loop
	});

}// END: generateLinesLayer

exports.setupPanels = function(attributes) {

//	setupLineVisibility();
	setupLineFixedColorPanel(attributes);
	setupLineColorAttributePanel(attributes);
	setupLineFixedOpacityPanel(attributes);
	setupLineFixedCurvaturePanel(attributes);
	setupLineFixedWidthPanel(attributes);
	setupLineCutoffPanel(attributes);

}// END: setupPanels

function setupLineFixedColorPanel(attributes) {

	var lineFixedColorSelect = document.getElementById("lineFixedColor");
	var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
			global.fixedColors);

	for (var i = 0; i < global.fixedColors.length; i++) {

		var option = global.fixedColors[i];
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		lineFixedColorSelect.appendChild(element);

	}// END: i loop

	// select the default
	lineFixedColorSelect.selectedIndex = lineDefaultColorIndex;

	// line fixed color listener
	d3
			.select(lineFixedColorSelect)
			.on(
					'change',
					function() {

						var colorSelect = lineFixedColorSelect.options[lineFixedColorSelect.selectedIndex].text;
						var color = scale(colorSelect);

						linesLayer.selectAll(".line") //
						.transition() //
						.ease("linear") //
						.attr("stroke", color);

						// setup legend
						updateLineFixedColorLegend(scale);

					});

}// END: setupLineFixedColorPanel

updateLineFixedColorLegend = function(scale) {

	var width = 150;
	var height = 230;

	var margin = {
		left : 20,
		top : 20
	};

	$('#lineFixedColorLegend').html('');
	var svg = d3.select("#lineFixedColorLegend").append('svg').attr("width",
			width).attr("height", height);

	var lineFixedColorLegend = d3.legend.color().scale(scale).shape('line')
			.shapeWidth(20).shapePadding(15).cells(5).orient('vertical')

	svg.append("g").attr("class", "lineFixedColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
			lineFixedColorLegend);

}// END: updateLineFixedColorLegend

function setupLineColorAttributePanel(attributes) {

	var lineColorAttributeSelect = document
			.getElementById("lineColorAttribute");

	for (var i = 0; i < attributes.length; i++) {

		var option = attributes[i].id;
		var element = document.createElement("option");
		element.textContent = option;
		element.value = option;

		lineColorAttributeSelect.appendChild(element);
	}// END: i loop

	// line color attribute listener
	d3
			.select(lineColorAttributeSelect)
			.on(
					'change',
					function() {

						var colorAttribute = lineColorAttributeSelect.options[lineColorAttributeSelect.selectedIndex].text;
						var attribute = utils.getObject(attributes, "id",
								colorAttribute);

						var data;
						var scale;

						$('#lineStartColor').html('');
						$('#lineEndColor').html('');

						if (attribute.scale == global.ORDINAL) {

							data = attribute.domain;
							scale = d3.scale.ordinal().range(
									global.ordinalColors).domain(data);

							updateLineColorLegend(scale);

						} else if (attribute.scale == global.LINEAR) {

							data = attribute.range;
							scale = d3.scale.linear().domain(data).range(
									[ lineStartColor, lineEndColor ]);

							updateLineColorLegend(scale);

							// start color
							$('#lineStartColor').html("<h4>Start color<\/h4>");
							$('#lineStartColor').append(
									"<input class=\"lineStartColor\" \/>");

							$('.lineStartColor')
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

													lineStartColor = "#" + hex;
													scale.range([
															lineStartColor,
															lineEndColor ]);

													updateLineColorLegend(scale);

													// trigger repaint
													updateLineColors(scale,
															colorAttribute);

												}// END: onSelect
											});

							$('.lineStartColor').setColor(lineStartColor);

							// end color
							$('#lineEndColor').html("<h4>End color<\/h4>");
							$('#lineEndColor').append(
									"<input class=\"lineEndColor\" \/>");

							$('.lineEndColor')
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

													lineEndColor = "#" + hex;
													scale.range([
															lineStartColor,
															lineEndColor ]);

													updateLineColorLegend(scale);

													// trigger repaint
													updateLineColors(scale,
															colorAttribute);
												}// END: onSelect
											});

							$('.lineEndColor').setColor(lineEndColor);

						} else {
							console
									.log("Error occured when resolving scale type!");
						}

						// trigger repaint
						updateLineColors(scale, colorAttribute);

					});

}// END: setupLineColorAttributePanel

function updateLineColorLegend(scale) {

	var width = 150;
	var height = 110;

	var margin = {
		left : 20,
		top : 20
	};

	$('#lineColorLegend').html('');
	var svg = d3.select("#lineColorLegend").append('svg').attr("width", width)
			.attr("height", height);

	var lineColorLegend = d3.legend.color().scale(scale).shape('line')
			.shapeWidth(20).shapePadding(15).cells(5).orient('vertical');

	svg.append("g").attr("class", "lineColorLegend").attr("transform",
			"translate(" + (margin.left) + "," + (margin.top) + ")").call(
			lineColorLegend);

}// END:updateLineColorLegend

function updateLineColors(scale, colorAttribute) {

	linesLayer.selectAll(".line") //
	.transition() //
	.ease("linear") //
	.attr("stroke", function() {

		var line = d3.select(this);
		var attributeValue = line.attr(colorAttribute);
		var color = scale(attributeValue);

		if (attributeValue == null) {
			console.log("null attribute value found for line color attribute");
			color = "#000";
		}

		return (color);
	});

}// END: updateLineColors

function setupLineFixedOpacityPanel(attributes) {

	var step = 0.1
	var lineFixedOpacitySlider = d3.slider().axis(
			d3.svg.axis().orient("top").ticks(
					(max_line_opacity - min_line_opacity) / step)).min(
			min_line_opacity).max(max_line_opacity).step(step).value(
			lineOpacity);

	d3.select('#lineFixedOpacitySlider').call(lineFixedOpacitySlider);

	// line fixed opacity listener
	lineFixedOpacitySlider.on("slide", function(evt, value) {

		lineOpacity = value;

		// fill-opacity / stroke-opacity / opacity
		linesLayer.selectAll(".line") //
		.transition() //
		.ease("linear") //
		.attr("stroke-opacity", lineOpacity);

	});

}// END: setupLineFixedOpacityPanel

function setupLineFixedCurvaturePanel(attributes) {
	// TODO
}// END: setupLineFixedCurvaturePanel

function setupLineFixedWidthPanel(attributes) {

	var lineWidthSlider = d3.slider().axis(d3.svg.axis().orient("top"))
			.min(0.5).max(5.0).step(0.5).value(lineWidth);

	d3.select('#lineWidthSlider').call(lineWidthSlider);

	// line width listener
	lineWidthSlider.on("slide", function(evt, value) {

		lineWidth = value;

		linesLayer.selectAll(".line").transition().ease("linear") //
		.attr("stroke-width", lineWidth + "px");

	});

}// END: setupLineFixedWidthPanel

function setupLineCutoffPanel(attributes) {

	// TODO: discrete attributes
	
	var lineCutoffAttributeSelect = document.getElementById("lineCutoffAttribute");
	
	for (var i = 0; i < attributes.length; i++) {

		if (attributes[i].scale == global.LINEAR) {
			var option = attributes[i].id;
			var element = document.createElement("option");
			element.textContent = option;
			element.value = option;
			lineCutoffAttributeSelect.appendChild(element);
		}

	}// END: i loop
	
	
	// listener
	d3
			.select(lineCutoffAttributeSelect)
			.on(
					'change',
					function() {

						// clean-up
						$('#lineCutoffSlider').html('');
//						linesLayer.selectAll("path").style("visibility", null); 
						
						var cutoffAttribute = lineCutoffAttributeSelect.options[lineCutoffAttributeSelect.selectedIndex].text;
						var attribute = utils.getObject(attributes, "id",
								cutoffAttribute);

						// slider
						// TODO: discrete too
						if (attribute.scale == global.LINEAR) {

							var minValue = Math.floor(attribute.range[global.MIN_INDEX]);
							var maxValue = Math.ceil(attribute.range[global.MAX_INDEX]);
							var step = (maxValue - minValue) / 10;

							var lineCutoffSlider = d3.slider().axis(
									d3.svg.axis().orient("top")).min(minValue)
									.max(maxValue).step(step).value(minValue);
							
							d3.select('#lineCutoffSlider').call(
									lineCutoffSlider);

							lineCutoffSlider.on("slide", function(evt, value) {

								linesLayer.selectAll("path").style("visibility", function(d) {

									var sliderValue = value;
									
									var line = d3.select(this);
									var attributeValue = line.attr(attribute.id);
									
									var visibility = "visible";
									// TODO: toggle
									if(attributeValue < sliderValue ){ // || !linesLayerCheckbox.checked) {
										visibility = "hidden";
									}
									
									return (visibility);
								});
								
							});
							
						}//END: scale check

					}// END: function
			);
	
	
	
	
	
	
	
}// END: setupLineCutoffPanel

exports.updateLinesLayer = function(value) {

	// ---select lines painting now---//

	linesLayer.selectAll("path.line")
	//
	.filter(
			function(d) {

				var linePath = this;
				var lineStartDate = utils.formDate(
						linePath.attributes.startTime.value).getTime();
				var lineEndDate = utils.formDate(
						linePath.attributes.endTime.value).getTime();

				return (lineStartDate <= value && value <= lineEndDate);
			})
	//
	.transition()
	//
	.ease("linear")
			//
			.attr(
					"stroke-dashoffset",
					function(d, i) {

						var linePath = this;
						var totalLength = linePath.getTotalLength();

						var lineStartDate = utils.formDate(
								linePath.attributes.startTime.value).getTime();
						var lineEndDate = utils.formDate(
								linePath.attributes.endTime.value).getTime();
						var duration = lineEndDate - lineStartDate;
						var timePassed = value - lineStartDate;

						var offset = totalLength;
						if (duration == 0) {

							offset = 0;

						} else {

							offset = utils.map(timePassed, 0, duration, 0,
									totalLength);

							// if (d.westofsource) {
							//
							// offset = offset + totalLength;
							//
							// } else {

							offset = totalLength - offset;
							// }

						}// END: instantaneous line check

						return (offset);
					}) //
			.attr("visibility", "visible");

	// ---select lines yet to be painted---//

	linesLayer.selectAll("path.line") //
	.filter(
			function(d) {
				var linePath = this;
				var lineStartDate = utils.formDate(
						linePath.attributes.startTime.value).getTime();

				return (lineStartDate > value);
			}) //
	.attr("stroke-dashoffset", function(d, i) {
		var linePath = this;
		var totalLength = linePath.getTotalLength();

		return (totalLength);
	}) //
	.attr("visibility", "hidden");

	// ---select lines already painted---//

	linesLayer.selectAll("path.line") //
	.filter(
			function(d) {
				var linePath = this;
				var lineEndDate = utils.formDate(
						linePath.attributes.endTime.value).getTime();

				return (lineEndDate < value);
			}) //
	.attr("stroke-dashoffset", 0) //
	.attr("visibility", "visible");

}// END: updateLinesLayer
