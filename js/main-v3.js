function get_times_array ($mode) {
	/* Get these times from a file */
	var $sleepTimes = ['0000', '1400', '2000'];
	var $wakeTimes = ['0730', '1600']

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

function timestamp_to_hours () {
	var $timestamp = new Date();
	var $hours = $timestamp.getHours();
	var $minutes = $timestamp.getMinutes();

	$hours = $hours<10?"0"+$hours:$hours;	
	$minutes = $minutes<10?"0"+$minutes:$minutes;

	return $hours.toString() + $minutes.toString();
}

function day_of_week () {
	var $timestamp = new Date();
	var $daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
	var $day = $timestamp.getDay();

	return $daysOfWeek[$day];
}
