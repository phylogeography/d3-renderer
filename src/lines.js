/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
// require("script!kodama");
var d3 = require('d3');
require("script!./d3-legend.js");
var utils = require('./utils.js');
var global = require('./global.js');
require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//
var linesLayer;
var linesLayerCheckbox;

var lineDefaultColorIndex = 12;
var lineStartColor = global.pairedSimpleColors[0];
var lineEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];
var lineWidth = 2;
var min_line_width = 0.5;
var max_line_width = 5;

var lineOpacity = 0.5;
var min_line_opacity = 0.3;
var max_line_opacity = 1;

var lineCurvature = 0.1;
var min_line_curvature = 0.0;
var max_line_curvature = 1.0;

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generateLinesLayer = function(branches, nodes, branchAttributes) {

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

          var curvature;
          var startTime = line.startTime;
          // if (typeof startTime != "undefined") {

          curvature = lineCurvature; // scale(formDate(line.startTime));

          // } else {
          // 	curvature = min_line_curvature;
          // }

          var startY = startCoordinate.yCoordinate;
          var startX = startCoordinate.xCoordinate;

          var endY = endCoordinate.yCoordinate;
          var endX = endCoordinate.xCoordinate;

          var sourceXY = global.projection([startX, // long
            startY // lat
          ]);

          var targetXY = global.projection([endX, // long
            endY // lat
          ]);

          var sourceX = sourceXY[0]; // long
          var sourceY = sourceXY[1]; // lat

          var targetX = targetXY[0]; // long
          var targetY = targetXY[1]; // lat

          // store for referencing in curvature listener
          line['targetX'] = targetX;
          line['targetY'] = targetY;
          line['sourceX'] = sourceX;
          line['sourceY'] = sourceY;

          var dx = targetX - sourceX;
          var dy = targetY - sourceY;
          var dr = Math.sqrt(dx * dx + dy * dy) * Math.log(curvature);

          var bearing = "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

          return (bearing);

        }) //
      .attr("fill", "none") //
      .attr("stroke-width", lineWidth + "px") //
      .attr("stroke-linejoin", "round") //
      .attr("stroke", global.fixedColors[lineDefaultColorIndex]) //
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
      .attr("opacity", lineOpacity);

    // dump attribute values into DOM
    lines[0].forEach(function(d, i) {

      var thisLine = d3.select(d);
      var properties = branches[i].attributes;

      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {

          thisLine.attr(property, properties[property]);

        }
      } // END: properties loop
    });

  } // END: generateLinesLayer

exports.setupPanels = function(attributes) {

    setupLinesLayerCheckbox();
    setupLineFixedColorPanel();
    setupLineColorAttributePanel(attributes);
    setupLineFixedOpacityPanel();
    setupLineFixedCurvaturePanel();
    setupLineFixedWidthPanel();
    setupLineCutoffPanel(attributes);

  } // END: setupPanels

function setupLinesLayerCheckbox() {

  $('#layerVisibility')
    .append(
      "<input type=\"checkbox\" id=\"linesLayerCheckbox\"> Lines layer<br>");

  linesLayerCheckbox = document.getElementById("linesLayerCheckbox");
  // default state is checked
  linesLayerCheckbox.checked = true;

  d3.select(linesLayerCheckbox).on("change", function() {

    if (this.checked) {
      // remove style, then visibility is driven by the time-based
      // selections
      linesLayer.selectAll("path").style("visibility", null);
    } else {
      // style is superior to attribute, make them hidden
      linesLayer.selectAll("path").style("visibility", "hidden");
    }

  });

} // END: setupLinesVisibility

function setupLineFixedColorPanel() {

  var str =
    ("				<div class=\"panelcollapsed\">") +
    ("					<h2>Lines fixed color<\/h2>") +
    ("					<div class=\"panelcontent\">") +
    ("						<select id=\"lineFixedColor\">") +
    ("						<\/select>") +
    ("						<div id=\"lineFixedColorLegend\"><\/div>") +
    ("					<\/div>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  var lineFixedColorSelect = document.getElementById("lineFixedColor");
  var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
    global.fixedColors);

  for (var i = 0; i < global.fixedColors.length; i++) {

    var option = global.fixedColors[i];
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;

    lineFixedColorSelect.appendChild(element);

  } // END: i loop

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

} // END: setupLineFixedColorPanel

updateLineFixedColorLegend = function(scale) {

    var width = 150;
    var height = 230;

    var margin = {
      left: 20,
      top: 20
    };

    $('#lineFixedColorLegend').html('');
    var svg = d3.select("#lineFixedColorLegend").append('svg').attr("width",
      width).attr("height", height);

    var lineFixedColorLegend = d3.legend.color().scale(scale).shape('line')
      .shapeWidth(20).shapePadding(15).cells(5).orient('vertical')

    svg.append("g").attr("class", "lineFixedColorLegend").attr("transform",
      "translate(" + (margin.left) + "," + (margin.top) + ")").call(
      lineFixedColorLegend);

  } // END: updateLineFixedColorLegend

function setupLineColorAttributePanel(attributes) {

  var str = ("				<div class=\"panelcollapsed\">") +
    ("					<h2>Lines color attribute<\/h2>") +
    ("					<div class=\"panelcontent\">") +
    ("						<div id=\"lineStartColor\">") +
    ("						<\/div>") +
    ("						<div id=\"lineEndColor\">") +
    ("						<\/div>") +
    ("						<h4>Attribute<\/h4>") +
    ("						<select id=\"lineColorAttribute\">") +
    ("						<\/select>") +
    ("						<div id=\"lineColorLegend\"><\/div>") +
    ("					<\/div>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  var lineColorAttributeSelect = document
    .getElementById("lineColorAttribute");

  for (var i = 0; i < attributes.length; i++) {

    var option = attributes[i].id;
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;

    lineColorAttributeSelect.appendChild(element);
  } // END: i loop

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
            [lineStartColor, lineEndColor]);

          updateLineColorLegend(scale);

          // start color
          $('#lineStartColor').html("<h4>Start color<\/h4>");
          $('#lineStartColor').append(
            "<input class=\"lineStartColor\" \/>");

          $('.lineStartColor')
            .simpleColor({
              cellWidth: 13,
              cellHeight: 13,
              columns: 4,
              displayColorCode: true,
              colors: utils
                .getSimpleColors(global.pairedSimpleColors),

              onSelect: function(hex,
                  element) {

                  lineStartColor = "#" + hex;
                  scale.range([
                    lineStartColor,
                    lineEndColor
                  ]);

                  updateLineColorLegend(scale);

                  // trigger repaint
                  updateLineColors(scale,
                    colorAttribute);

                } // END: onSelect
            });

          $('.lineStartColor').setColor(lineStartColor);

          // end color
          $('#lineEndColor').html("<h4>End color<\/h4>");
          $('#lineEndColor').append(
            "<input class=\"lineEndColor\" \/>");

          $('.lineEndColor')
            .simpleColor({
              cellWidth: 13,
              cellHeight: 13,
              columns: 4,
              colors: utils
                .getSimpleColors(global.pairedSimpleColors),
              displayColorCode: true,
              onSelect: function(hex,
                  element) {

                  lineEndColor = "#" + hex;
                  scale.range([
                    lineStartColor,
                    lineEndColor
                  ]);

                  updateLineColorLegend(scale);

                  // trigger repaint
                  updateLineColors(scale,
                    colorAttribute);
                } // END: onSelect
            });

          $('.lineEndColor').setColor(lineEndColor);

        } else {
          console
            .log("Error occured when resolving scale type!");
        }

        // trigger repaint
        updateLineColors(scale, colorAttribute);

      });

} // END: setupLineColorAttributePanel

function updateLineColorLegend(scale) {

  var width = 150;
  var height = 110;

  var margin = {
    left: 20,
    top: 20
  };

  $('#lineColorLegend').html('');
  var svg = d3.select("#lineColorLegend").append('svg').attr("width", width)
    .attr("height", height);

  var lineColorLegend = d3.legend.color().scale(scale).shape('line')
    .shapeWidth(20).shapePadding(15).cells(5).orient('vertical');

  svg.append("g").attr("class", "lineColorLegend").attr("transform",
    "translate(" + (margin.left) + "," + (margin.top) + ")").call(
    lineColorLegend);

} // END:updateLineColorLegend

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

} // END: updateLineColors

function setupLineFixedOpacityPanel() {

  var str = ("                <div class=\"panelcollapsed\">") +
    ("                    <h2>Lines opacity<\/h2>") +
    ("                    <div class=\"panelcontent\">") +
    ("                            <div id=\"lineFixedOpacitySlider\"><\/div>") +
    ("                    <\/div>") +
    ("                <\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  $('#lineFixedOpacitySlider').html('<input type="range" class="lineFixedOpacitySlider" step="0.1" min="' + min_line_opacity + '" max="' + max_line_opacity + '" value="' + lineOpacity + '"  />');
  $('#lineFixedOpacitySlider').append('<span>' + lineOpacity + '</span>');

  $('.lineFixedOpacitySlider').on("input", function() {

    lineOpacity = $(this).val();

    $(this).next().html(lineOpacity);

    // fill-opacity / stroke-opacity / opacity
    linesLayer.selectAll(".line") //
      .transition() //
      .ease("linear") //
      .attr("stroke-opacity", lineOpacity);

  });

} // END: setupLineFixedOpacityPanel

function setupLineFixedCurvaturePanel() {

  var str = (" <div class=\"panelcollapsed\">") +
    (" <h2>Lines curvature<\/h2>") +
    (" <div class=\"panelcontent\">") +
    (" <div id=\"lineFixedCurvatureSlider\"><\/div>") +
    (" <\/div>") +
    (" <\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  $('#lineFixedCurvatureSlider').html('<input type="range" class="lineFixedCurvatureSlider" step="0.1" min="' + min_line_curvature + '" max="' + max_line_curvature + '" value="' + lineCurvature + '"  />');
  // $('#lineFixedCurvatureSlider').append('<span>' + lineCurvature + '</span>');

  $('.lineFixedCurvatureSlider').on("input", function() {

    value = $(this).val();

    //  $(this).next().html(value);

    if (value == 0) {
      lineCurvature = 0;
    } else if (value == 1) {
      lineCurvature = 0.1;
    } else {
      lineCurvature = (1 - value);
    }

    linesLayer.selectAll(".line").transition().ease("linear") //
      .attr(
        "d",
        function(d) {

          var line = d;

          // console.log(Date.parse(line.startTime));

          // var curvature = lineCurvature;

          var targetX = line.targetX;
          var targetY = line.targetY;
          var sourceX = line.sourceX;
          var sourceY = line.sourceY;

          var dx = targetX - sourceX;
          var dy = targetY - sourceY;
          var dr = Math.sqrt(dx * dx + dy * dy) * lineCurvature;

          var bearing = "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

          return (bearing);

        }) //
      .attr("stroke-dasharray", function(d) {

        var totalLength = d3.select(this).node().getTotalLength();
        return (totalLength + " " + totalLength);

      });

  });

} // END: setupLineFixedCurvaturePanel

function setupLineFixedWidthPanel() {

  var str = ("				<div class=\"panelcollapsed\">") +
    ("					<h2>Lines width<\/h2>") +
    ("					<div class=\"panelcontent\">") +
    ("							<div id=\"lineFixedWidthSlider\"><\/div>") +
    ("					<\/div>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  $('#lineFixedWidthSlider').html('<input type="range" class="lineFixedWidthSlider" step="0.5" min="' + min_line_width + '" max="' + max_line_width + '" value="' + lineWidth + '"  />');
  $('#lineFixedWidthSlider').append('<span>' + lineWidth + '</span>');

  $('.lineFixedWidthSlider').on("input", function() {

    lineWidth = $(this).val();

    $(this).next().html(lineWidth);

    linesLayer.selectAll(".line").transition().ease("linear") //
      .attr("stroke-width", lineWidth + "px");

  });

} // END: setupLineFixedWidthPanel

function setupLineCutoffPanel(attributes) {

  var str = ("				<div class=\"panelcollapsed\">") +
    ("					<h2>Lines cut-off<\/h2>") +
    ("					<div class=\"panelcontent\">") +
    ("						<select id=\"lineCutoffAttribute\">") +
    ("						<\/select>") +
    ("						<\/br>") +
    ("						<\/br>") +
    ("						<\/br>") +
    ("					<div class=\"wrapper\">") +
    ("							<div id=\"lineCutoffSlider\"><\/div>") +
    ("					<\/div>") +
    ("					<\/div>") +
    ("				<\/div>");

  var html = $.parseHTML(str);

  $(".selectors").append(html);

  var lineCutoffAttributeSelect = document
    .getElementById("lineCutoffAttribute");

  for (var i = 0; i < attributes.length; i++) {

    // TODO: discrete attributes
    if (attributes[i].scale == global.LINEAR) {
      var option = attributes[i].id;
      var element = document.createElement("option");
      element.textContent = option;
      element.value = option;
      lineCutoffAttributeSelect.appendChild(element);
    }

  } // END: i loop

  // listener
  d3
    .select(lineCutoffAttributeSelect)
    .on(
      'change',
      function() {

        // clean-up
        $('#lineCutoffSlider').html('');
        // linesLayer.selectAll("path").style("visibility",
        // null);

        var cutoffAttribute = lineCutoffAttributeSelect.options[lineCutoffAttributeSelect.selectedIndex].text;
        var attribute = utils.getObject(attributes, "id",
          cutoffAttribute);

        // slider
        // TODO: discrete too
        if (attribute.scale == global.LINEAR) {

          var minValue = Math
            .floor(attribute.range[global.MIN_INDEX]);
          var maxValue = Math
            .ceil(attribute.range[global.MAX_INDEX]);
          var step = (maxValue - minValue) / 10;

          var lineCutoffSlider = d3.slider().axis(
              d3.svg.axis().orient("top")).min(minValue)
            .max(maxValue).step(step).value(minValue);

          d3.select('#lineCutoffSlider').call(
            lineCutoffSlider);

          lineCutoffSlider
            .on(
              "slide",
              function(evt, value) {

                linesLayer
                  .selectAll("path")
                  .style(
                    "visibility",
                    function(d) {

                      var sliderValue = value;

                      var line = d3
                        .select(this);
                      var attributeValue = line
                        .attr(attribute.id);

                      var visibility = "visible";

                      if (attributeValue < sliderValue || !linesLayerCheckbox.checked) {
                        visibility = "hidden";
                      }

                      return (visibility);
                    });

              });

        } // END: scale check

      } // END: function
    );

} // END: setupLineCutoffPanel

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

            offset = totalLength - offset;

          } // END: instantaneous line check

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

  } // END: updateLinesLayer
