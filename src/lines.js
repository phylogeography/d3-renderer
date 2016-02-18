/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
// require("script!kodama");
var d3 = require('d3');
var utils = require('./utils.js');
var global = require('./global.js');

// ---MODULE VARIABLES---//

var linesLayer;
var lineWidth = 2;

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

}// END: generateLinesLayer

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
