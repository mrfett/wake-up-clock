/* ======================= Workflow ===========================================

Get override status

Get array of sleep times
Get array of wake times
Get combined array

Get current time

Find closest past time
Find whether closest time is sleep or wake

Set current state

============================================================================= */

/*====================== New JS (Tested) =====================================*/

/* Check every second for a time change, then start timeKeeper() when the minute is updated */
function syncTime() {
	var $startTime = timestamp_to_hours();

	update_display();

	var $syncTimeLoopID = setInterval(function(){
		console.log('checking for minute change');
		var $currentTime = timestamp_to_hours();

		// Update time if the minute is different
		if ($startTime != $currentTime) {
			clearInterval($syncTimeLoopID);
			console.log('Time has changed; Starting timeKeeper.')
			update_display();
			timeKeeper();
		}

	}, 1000);

}

/* Main timekeeping function, runs every minute after the sync function */
function timeKeeper() {
	console.log('Time keeper function started.');

	setInterval(function(){
		update_display();
	}, 60000);
}

/* Update the display */
function update_display() {
	var $currentTime = timestamp_to_hours();
	//set_override();
	var $override = $('#overrideStatus').text();
	console.log('Override returned: ' + $override);
	var $day = day_of_week();

	if ($override != null) {
		set_mode($override);
	} else {
		console.log('No override set; calculating sleep/wake status');
		var $sleepTimes = get_times_array('sleep');
		var $wakeTimes = get_times_array('wake');
		console.log('Sleep times: ' + $sleepTimes);
		var $allTimes = my_combine_arrays($sleepTimes, $wakeTimes);


		console.log('Wake times: ' + $wakeTimes);
		console.log('Array of all times: ' + $allTimes);

		var $closestTime = get_closest_value ($currentTime, $allTimes);
		var $mode = sleep_or_wake($closestTime.toString(), $sleepTimes, $wakeTimes);

		console.log('Mode calculated; setting mode to ' + $mode);

		set_mode($mode);
	}

	update_time(format_time($currentTime));
	update_days($day);
}

/* Get the string value for override */
function set_override() {
	/* Load from file */
	$.get("scripts/getOverride.php")
	.success(function(data) {
		$('#overrideStatus').text(data);
	})
	.fail(function () {alert('Error');});

}

/* Merge two arrays */
function my_combine_arrays ($array1, $array2) {
	var $firstArray = $array1;
	var $secondArray = $array2;
	var $combinedArray =  new Array();
	$combinedArray = $array1.slice();
	$.merge($combinedArray, $secondArray);

//	var $combinedArray = ['0000', '1400', '2000', '0730', '1600'];
	return $combinedArray;
}

/* Get the array of times for sleep or wake */
function get_times_array ($mode) {
	/* Get these times from a file */
	var $sleepTimes = ['0000', '1400', '2000'];
	var $wakeTimes = ['0730', '1600'];

	if ($mode == 'sleep') {
		var $timesArray = $sleepTimes;
	} else if ($mode == 'wake') {
		var $timesArray = $wakeTimes;
	} else {
		var $timesArray = 'error';
	}

	console.log('returning array of times for ' + $mode);

	return $timesArray;
}

/* Get the 4 digit time based on a timestamp; default to now */
function timestamp_to_hours ($timestamp) {
	$timestamp = typeof $timestamp !== 'undefined' ? $timestamp : new Date();
	var $hours = $timestamp.getHours();
	var $minutes = $timestamp.getMinutes();

	$hours = $hours<10?"0"+$hours:$hours;
	$minutes = $minutes<10?"0"+$minutes:$minutes;

	return $hours.toString() + $minutes.toString();
}

/* Get the day of the week based on a timestamp; default to now */
function day_of_week ($timestamp) {
	$timestamp = typeof $timestamp !== 'undefined' ? $timestamp : new Date();
	var $daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	var $day = $timestamp.getDay();
	var $today = $daysOfWeek[$day];
	if ($day != 0) {
		var $yesterday = $daysOfWeek[$day - 1];
	} else {
		var $yesterday = "saturday";
	}
	if ($day != 6) {
		var $tomorrow = $daysOfWeek[$day + 1];
	} else {
		var $tomorrow = "sunday";
	}
	console.log('Yesterday: ' + $yesterday);
	console.log('Today: ' + $today);
	console.log('Tomorrow: ' + $tomorrow);

	var $daysArray = [$yesterday, $today, $tomorrow];

	return $daysArray;
}

/* Find the closest item to a given value in an array */
function get_closest_value ($number, $array) {
	var $closest = null;
	$.each($array, function () {
		if (($closest == null) || (this <= $number && this > $closest)) {
			$closest = this;
		}
	});
	console.log('Closest time calculated to be: ' + $closest);
	return $closest;
}

/* Find the given value in the sleep or away arrays; return error if not found or found in both */
function sleep_or_wake($value, $sleepArray, $wakeArray) {
	console.log('Checking if ' + $value + ' is in ' + $sleepArray + ' or ' + $wakeArray + '...');
	if (($.inArray($value, $sleepArray) != -1) && ($.inArray($value, $wakeArray) == -1)) {
		return 'sleep';
	} else if (($.inArray($value, $wakeArray) != -1) && ($.inArray($value, $sleepArray) == -1)) {
		return 'wake';
	} else {
		return 'error';
		console.log('=== Error getting sleep/wake value');
	}
}

/* Set the sleep or wake mode for the page */
function set_mode($mode) {
	if ($mode == 'wake') {
		$('body').removeClass('sleep').addClass('wake');
	} else if ($mode == 'sleep') {
		$('body').removeClass('wake').addClass('sleep');
	} else {
		$('body').removeClass('wake').addClass('sleep error');
	}

}

/* Convert 4 digit time into a nice display format */
function format_time($time) {
	if ($time.length == 4) {
		var $timeArray = $time.match(/.{1,2}/g);
		var $hours = $timeArray[0];
		var $minutes = $timeArray[1];

		if ($hours >= 12) {
			var $ampm = 'pm';
			$hours = $hours - 12;
		} else {
			var $ampm = 'am';
		}

		var $formattedTime = '<span class="hours">' + $hours + '</span><span class="minutes">' + $minutes + '</span><span class="ampm">' + $ampm + '</span>';

		return $formattedTime;

	} else {
		return 'error';
		console.log('=== Error formatting the time');
	}
}

/* update the time display */
function update_time($time) {
	$('div.time').html($time);
}

/* update the day display */
function update_days($day) {
	$('li.yesterday').text($day[0]);
	$('li.today').text($day[1]);
	$('li.tomorrow').text($day[2]);
}
