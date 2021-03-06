/**
 * @fbielejec
 */

// ---EXPORTS---//
var exports = module.exports = {};

exports.formDate = function(dateString) {

	var dateFields = dateString.split("/");
	var year = dateFields[0];
	var month = dateFields[1];
	var day = dateFields[2];

	var date = new Date(year, month, day);
	// var date = Date.UTC(year, month, day);

	return (date);
}// END: formDate

exports.map = function(value, fromLow, fromHigh, toLow, toHigh) {
	return (toLow + (toHigh - toLow)
			* ((value - fromLow) / (fromHigh - fromLow)));
}// END: map

exports.capitalizeFirstLetter = function(string) {
	return string[0].toUpperCase() + string.slice(1);
}// END: capitalizeFirstLetter

exports.getObject = function(objects, key, val) {
	var newObj = false;
	$.each(objects, function() {
		var testObject = this;
		$.each(testObject, function(k, v) {
			// alert(k);
			if (val == v && k == key) {
				newObj = testObject;
			}
		});
	});

	return newObj;
}// END: getObject

exports.alternatingColorScale = function() {
	var domain;
	var range;

	function scale(x) {
		return (range[domain.indexOf(x) % range.length]);
	}

	scale.domain = function(x) {
		if (!arguments.length) {
			return (domain);
		}
		domain = x;
		return (scale);
	}

	scale.range = function(x) {
		if (!arguments.length) {
			return (range);
		}

		range = x;
		return scale;
	}

	return scale;
}// END: alternatingColorScale

exports.getSimpleColors = function(colors) {
	var simpleColors = [];

	var arrayLength = colors.length;
	for (var i = 0; i < arrayLength; i++) {

		var color = colors[i];
		if (color.charAt(0) === '#') {
			color = color.substr(1);
			simpleColors[i] = color;
		}

	}

	return simpleColors;
}// END: getSimpleColors
