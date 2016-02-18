/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("script!kodama");
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

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

var pointsLayer;

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

		return {
			title : d.attributes.nodeName,
			items : [ {
				title : 'Antigenic1',
				value : (d.attributes.antigenic1).toFixed(2)
			}, //
			{
				title : 'Antigenic2',
				value : (d.attributes.antigenic2).toFixed(2)
			}, {
				title : 'Antigenic3',
				value : (d.attributes.antigenic3).toFixed(2)
			},//

			{
				title : 'Lineage',
				value : d.attributes.lineage
			}

			]
		};

	}) //
	.theme('nodesTheme'));

}// END: generatePointsLayer

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

	// ---select point displayed now---//

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

// ---FUNCTIONS---//
