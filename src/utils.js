/**
 * @fbielejec
 */

//---EXPORTS---//

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

exports.getObject = function(obj, key, val) {
	var newObj = false;
	$.each(obj, function() {
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