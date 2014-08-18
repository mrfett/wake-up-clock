function syncTime() {
	var $minutes = null;
	
	var $syncTimeLoopID = setInterval(function(){
		console.log('checking for minute change');
		var $currentTime = new Date();
		var $newMinutes = $currentTime.getMinutes();
		
		// Update time if the minute is different
		if ($minutes != $newMinutes) {
			if ($minutes != null) {
				clearInterval($syncTimeLoopID);
				console.log('Minute has changed; Starting timeKeeper.')
				timeKeeper();
			}
			updateTime($currentTime);
			$minutes = $newMinutes;
		}

	}, 1000);
	
}

function timeKeeper() {
	console.log('Time keeper function started.');
	
	setInterval(function(){
		console.log('Updating Time');

		var $currentTime = new Date();
		console.log('Current Mode: ' + $currentMode);
		updateTime($currentTime);
		
	}, 60000);
}

function updateTime($timestamp) {
	var $hours = $timestamp.getHours();
	var $minutes = $timestamp.getMinutes();
	var $seconds = $timestamp.getSeconds();
	var $day = $timestamp.getDay();
	var $ampm = 'am';

	if (!$override) {
		$currentMode = getSleepOrWake($hours, $minutes);
	} else {
		$currentMode = $override;
	}
	activateMode($currentMode);
	
	if ($hours >= 12) {
		$ampm = 'pm';
		$hours = $hours - 12;
	}
	if ($hours == 0) {
		$hours = 12;
	}

	$minutes = $minutes<10?"0"+$minutes:$minutes;

	$seconds = $seconds<10?"0"+$seconds:$seconds;
	
	$('.hours').text($hours);
	$('.minutes').text($minutes);
	$('.seconds').text($seconds);
	$('.ampm').text($ampm);
	
	$('.today').text($daysOfWeek[$day]).removeClass($daysOfWeek.join(' ')).addClass($daysOfWeek[$day]);
	$('.tomorrow').text($daysOfWeek[($.inArray($daysOfWeek[$day], $daysOfWeek) + 1) % $daysOfWeek.length]);
	$('.yesterday').text($daysOfWeek[($.inArray($daysOfWeek[$day], $daysOfWeek) - 1 + $daysOfWeek.length) % $daysOfWeek.length]);
	
}

function getSleepOrWake($hours, $minutes) {
	console.log('============= Getting Sleep or Wake status ==================');
	$hours = $hours<10?"0"+$hours:$hours;
	$minutes = $minutes<10?"0"+$minutes:$minutes;
	var $currentTimeFormatted = $hours.toString() + $minutes.toString();
	console.log('Current Time Formatted: ' + $currentTimeFormatted);
	
	$closestSleepTime = getClosestTime('sleep', $currentTimeFormatted);
	$closestWakeTime = getClosestTime('wake', $currentTimeFormatted);
	
	if (parseInt($closestSleepTime) < parseInt($closestWakeTime)) {
		if ($currentMode != 'wake') {
			$currentMode = 'wake';
			activateMode($currentMode);
		}
	} else if ($currentMode != 'sleep') {
		$currentMode = 'sleep';
	}
	console.log('Current mode set to: ' + $currentMode);
		
	return $currentMode;
}

function activateMode($mode) {
	if ($mode == 'wake') {
		$('body').removeClass('sleep').addClass('wake');
		$('body').css('background-color', 'blue');
	} else {
		$('body').removeClass('wake').addClass('sleep');
	}
		
}

function getClosestTime($type, $currentTime) {
	if ($type == 'sleep') {
		var $times = ['2000', '1400'];
	} else {
		var $times = ['0730', '1600'];
	}
	var $closestTime = null;
	
	$.each($times, function() {
		console.log('Checking ' + $type + ' time: ' + this);
		if ($closestTime == null && parseInt(this) < parseInt($currentTime) || (parseInt($closestTime) < parseInt(this)) && (parseInt(this) < parseInt($currentTime))) {
			$closestTime = this;
			console.log('Updated closest ' + $type + ' time to: ' + this.toString());
		}
	});
	 if ($closestTime == null) {
		console.log('Closest time was yesterday, setting time to 0000');
		$closestTime = '0000';
	}
	console.log('Closest ' + $type + ' Time: ' + $closestTime);
	return $closestTime;
}
