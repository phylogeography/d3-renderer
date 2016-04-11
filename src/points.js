/**
 * @fbielejec
 */

// ---MODULE IMPORTS---//
require("script!kodama");
var d3 = require('d3');
require("script!./d3-legend.js");

var utils = require('./utils.js');
var global = require('./global.js');

// var slider = require('rangeslider.js');
// require("script!rangeslider.js");

require("imports?$=jquery!rangeslider.js");

// import("./jquery.simple-color.js");
require("imports?$=jquery!./jquery.simple-color.js");

// ---MODULE VARIABLES---//

var pointsLayer;

var pointDefaultColorIndex = 6;
var pointStartColor = global.pairedSimpleColors[0];
var pointEndColor = global.pairedSimpleColors[global.pairedSimpleColors.length - 1];

var pointRadius = 2;
var min_point_radius = 1;
var max_point_radius = 7;

var tooltipAttributes = {
  color: null,
  radius: null
}

d3.kodama
  .themeRegistry(
    'nodesTheme', {
      frame: {
        padding: '4px',
        background: 'linear-gradient(to top, rgb(16, 74, 105) 0%, rgb(14, 96, 125) 90%)',
        'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
        'border': '1px solid rgb(57, 208, 204)',
        color: 'rgb(245,240,220)',
        'border-radius': '4px',
        'font-size': '12px',
        'box-shadow': '0px 1px 3px rgba(0,20,40,.5)'
      },
      title: {
        'text-align': 'center',
        'padding': '4px'
      },
      item_title: {
        'text-align': 'right',
        'color': 'rgb(220,200,120)'
      },
      item_value: {
        'padding': '1px 2px 1px 10px',
        'color': 'rgb(234, 224, 184)'
      }
    });

// ---MODULE EXPORTS---//

var exports = module.exports = {};

exports.generatePointsLayer = function(nodes, locations, nodeAttributes) {

    pointsLayer = global.g.append("g").attr("class", "pointsLayer");

    var points = pointsLayer.selectAll("circle").data(nodes).enter().append(
        "circle") //
      .attr("class", "point") //
      .attr("startTime", function(d) {

        return (d.startTime);

      }) //
      .attr("cx", function(d) {

        var pointCoordinate = d['coordinate'];
        if (typeof pointCoordinate == 'undefined') {
          // discrete
          var pointLocationId = d.locationId;
          var pointLocation = utils.getObject(locations, "id", pointLocationId);
          pointCoordinate = pointLocation.coordinate;
          d['coordinate'] = pointCoordinate;
        }

        var xy = global.projection([pointCoordinate.xCoordinate, // long
          pointCoordinate.yCoordinate // lat
        ]);

        var cx = xy[0]; // long

        return (cx);
      }) //
      .attr(
        "cy",
        function(d) {

          var pointCoordinate = d['coordinate'];
          if (typeof pointCoordinate == 'undefined') {
            // discrete
            var pointLocationId = d.locationId;
            var pointLocation = utils.getObject(locations, "id", pointLocationId);
            pointCoordinate = pointLocation.coordinate;
            d['coordinate'] = pointCoordinate;
          }

          var xy = global.projection([pointCoordinate.xCoordinate, // long
            pointCoordinate.yCoordinate // lat
          ]);

          var cy = xy[1]; // lat

          return (cy);
        }) //
      .attr("r", pointRadius) //
      .attr("fill", global.fixedColors[pointDefaultColorIndex]) //
      .attr("stroke", "black") //
      .attr("opacity", 1.0) //
      .on('mouseover', function(d) {

        var point = d3.select(this);
        point.attr('stroke', 'white');

      }) //
      .on('mouseout', function(d, i) {

        var point = d3.select(this);
        point.attr('stroke', "black");

      });

    updateTooltips();

    // dump attribute values into DOM
    points[0].forEach(function(d, i) {

      var thisPoint = d3.select(d);
      var properties = nodes[i].attributes;

      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {

          thisPoint.attr(property, properties[property]);

        }
      } // END: properties loop
    });

  } // END: generatePointsLayer

exports.setupPanels = function(attributes) {

    setupPointsLayerCheckbox();
    setupPointFixedColorPanel();
    setupPointColorAttributePanel(attributes);
    setupPointFixedRadiusPanel();
    setupPointRadiusAttributePanel(attributes);

  } // END: setupPanels

function setupPointsLayerCheckbox() {

  $('#layerVisibility')
    .append(
      "<input type=\"checkbox\" id=\"pointsLayerCheckbox\"> Points layer<br>");

  var pointsLayerCheckbox = document.getElementById("pointsLayerCheckbox");
  // default state is checked
  pointsLayerCheckbox.checked = true;

  d3.select(pointsLayerCheckbox).on("change", function() {

    var visibility = this.checked ? "visible" : "hidden";
    pointsLayer.selectAll("circle").style("visibility", visibility);
    // locationsLayer.selectAll("circle").style("visibility", visibility);

  });

} // END: setupPointsLayerCheckbox

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

  } // END: updatePointsLayer

// ---MODULE PRIVATE FUNCTIONS---//

updatePointColorLegend = function(scale) {

    var width = 150;
    var height = 110;

    var margin = {
      left: 20,
      top: 20
    };

    $('#pointColorLegend').html('');
    var svg = d3.select("#pointColorLegend").append('svg').attr("width", width)
      .attr("height", height);

    var pointColorLegend = d3.legend.color().scale(scale).shape('circle')
      .shapeRadius(5).shapePadding(10).cells(5).orient('vertical')

    svg.append("g").attr("class", "pointColorLegend").attr("transform",
      "translate(" + (margin.left) + "," + (margin.top) + ")").call(
      pointColorLegend);

  } // END: updateColorScale

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

  } // END: updatePointColors

updateTooltips = function() {

    pointsLayer
      .selectAll(".point")
      .call(
        d3.kodama
        .tooltip()
        .format(
          function(d, i) {

            var tooltipItems = [];
            for (var tooltipAttribute in tooltipAttributes) { //

              if (tooltipAttributes[tooltipAttribute]) {
                var element = {};
                element.title = utils
                  .capitalizeFirstLetter(tooltipAttribute);
                element.value = tooltipAttributes[tooltipAttribute] + "=" + d.attributes[tooltipAttributes[tooltipAttribute]];
                tooltipItems.push(element);
              } // END: null check

            } // END: attributes loop

            return {
              title: d.attributes.nodeName,
              items: tooltipItems
            };

          }).theme('nodesTheme') //
      );

  } // END: updateTooltips

updatePointFixedColorLegend = function(scale) {

    var width = 150;
    var height = 265;

    var margin = {
      left: 20,
      top: 20
    };

    $('#pointFixedColorLegend').html('');
    var svg = d3.select("#pointFixedColorLegend").append('svg').attr("width",
      width).attr("height", height);

    var pointFixedColorLegend = d3.legend.color().scale(scale).shape('circle')
      .shapeRadius(5).shapePadding(10).cells(5).orient('vertical')

    svg.append("g").attr("class", "pointFixedColorLegend").attr("transform",
      "translate(" + (margin.left) + "," + (margin.top) + ")").call(
      pointFixedColorLegend);

  } // END: updatePointFixedColorLegend

setupPointFixedColorPanel = function() {

    var str = ("				<div class=\"panelcollapsed\">") +
      ("					<h2>Points fixed color<\/h2>") +
      ("					<div class=\"panelcontent\">") +
      ("						<select id=\"pointFixedColor\">") +
      ("						<\/select>") +
      ("						<div id=\"pointFixedColorLegend\"><\/div>") +
      ("					<\/div>") +
      ("				<\/div>");

    var html = $.parseHTML(str);

    $(".selectors").append(html);

    var pointFixedColorSelect = document.getElementById("pointFixedColor");
    var scale = utils.alternatingColorScale().domain(global.fixedColors).range(
      global.fixedColors);

    for (var i = 0; i < global.fixedColors.length; i++) {

      var option = global.fixedColors[i];
      var element = document.createElement("option");
      element.textContent = option;
      element.value = option;

      pointFixedColorSelect.appendChild(element);

    } // END: i loop

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

    tooltipAttributes['color'] = null;
    updateTooltips();

  } // END: setupFixedColorPanel

setupPointColorAttributePanel = function(attributes) {

    var str = ("				<div class=\"panelcollapsed\">") +
      ("					<h2>Points color attribute<\/h2>") +
      ("					<div class=\"panelcontent\">") +
      ("						<div id=\"pointStartColor\">") +
      ("						<\/div>") +
      ("						<div id=\"pointEndColor\">") +
      ("						<\/div>") +
      ("						<h4>Attribute<\/h4>") +
      ("						<select id=\"pointColorAttribute\">") +
      ("						<\/select>") +
      ("						<div id=\"pointColorLegend\"><\/div>") +
      ("					<\/div>") +
      ("				<\/div>");

    var html = $.parseHTML(str);

    $(".selectors").append(html);

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

    } // END: i loop

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

            updatePointColorLegend(scale);

          } else if (attribute.scale == global.LINEAR) {

            data = attribute.range;

            scale = d3.scale.linear().domain(data).range(
              [pointStartColor, pointEndColor]);

            updatePointColorLegend(scale);

            // start color
            $('#pointStartColor').html("<h4>Start color<\/h4>");
            $('#pointStartColor').append(
              "<input class=\"pointStartColor\" \/>");

            $('.pointStartColor')
              .simpleColor({
                cellWidth: 13,
                cellHeight: 13,
                columns: 4,
                displayColorCode: true,
                colors: utils
                  .getSimpleColors(global.pairedSimpleColors),

                onSelect: function(hex,
                    element) {

                    pointStartColor = "#" + hex;

                    scale.range([
                      pointStartColor,
                      pointEndColor
                    ]);
                    updatePointColorLegend(scale);

                    // trigger repaint
                    updatePointColors(scale,
                      colorAttribute);

                  } // END: onSelect
              });

            $('.pointStartColor').setColor(pointStartColor);

            // end color
            $('#pointEndColor').html("<h4>End color<\/h4>");
            $('#pointEndColor').append(
              "<input class=\"pointEndColor\" \/>");

            $('.pointEndColor')
              .simpleColor({
                cellWidth: 13,
                cellHeight: 13,
                columns: 4,
                colors: utils
                  .getSimpleColors(global.pairedSimpleColors),
                displayColorCode: true,
                onSelect: function(hex,
                  element) {

                  pointEndColor = "#" + hex;

                  scale.range([
                    pointStartColor,
                    pointEndColor
                  ]);
                  updatePointColorLegend(scale);

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

          tooltipAttributes['color'] = colorAttribute;
          updateTooltips();

        });

  } // END: setupPointColorAttributePanel

setupPointFixedRadiusPanel = function() {

    var str = ("				<div class=\"panelcollapsed\">") +
      ("					<h2>Points fixed radius<\/h2>") +
      ("					<div class=\"panelcontent\">") +
      ("						<div id=\"pointFixedRadiusSlider\">") +
      ("						<\/div>") +
      ("					<\/div>") +
      ("				<\/div>");

    var html = $.parseHTML(str);

    $(".selectors").append(html);

    $('#pointFixedRadiusSlider').html('<input type="range" class="pointFixedRadiusSlider" step="1" min="' + min_point_radius + '" max="' + max_point_radius + '" value="' + pointRadius + '"  />');
    $('#pointFixedRadiusSlider').append('<span>' + pointRadius + '</span>');

    $('.pointFixedRadiusSlider').on("input", function() {

      pointRadius = $(this).val();

      $(this).next().html(pointRadius);

      pointsLayer.selectAll(".point") //
        .transition() //
        .ease("linear") //
        .attr("r", pointRadius);

    });

    tooltipAttributes['radius'] = null;
    updateTooltips();

  } // END: setupPointFixedAreaPanel

setupPointRadiusAttributePanel = function(attributes) {

    var str = ("				<div class=\"panelcollapsed\">") +
      ("					<h2>Points radius attribute<\/h2>") +
      ("					<div class=\"panelcontent\">") +
      ("						<select id=\"pointRadiusAttribute\">") +
      ("						<\/select>") +
      ("						  <div id=\"pointRadiusLegend\"  ><\/div>  ") +
      ("					<\/div>") +
      ("				<\/div>");

    var html = $.parseHTML(str);

    $(".selectors").append(html);

    var pointRadiusAttributeSelect = document
      .getElementById("pointRadiusAttribute");

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

    } // END: i loop

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
            var range = Array.apply(0, Array(data.length)).map(
              function(x, y) {
                return y + 1;
              });
            scale = d3.scale.ordinal().domain(data)
              .range(range);

            updatePointRadiusLegend(scale);

          } else if (attribute.scale == global.LINEAR) {

            data = attribute.range;
            scale = d3.scale.linear().domain(data).range(
              [min_point_radius, max_point_radius]);

            updatePointRadiusLegend(scale);

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

          tooltipAttributes['radius'] = radiusAttribute;
          updateTooltips();

        });

  } // END: setupPointAreaAttributePanel

updatePointRadiusLegend = function(scale) {

    var width = 150;
    var height = 200;

    var margin = {
      left: 20,
      top: 20
    };

    $('#pointRadiusLegend').html('');
    var svg = d3.select("#pointRadiusLegend").append('svg')
      .attr("width", width).attr("height", height);

    var pointRadiusLegend = d3.legend.size().scale(scale).shape('circle')
      .shapePadding(15).labelOffset(20).orient('vertical');
    // .title(capitalizeFirstLetter(sizeAttribute.id));

    svg.append("g").attr("class", "pointRadiusLegend").attr("transform",
      "translate(" + (margin.left) + "," + (margin.top) + ")").call(
      pointRadiusLegend);

  } // END: updatePointRadiusLegend
