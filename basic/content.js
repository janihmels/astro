$(document).ready(function() {
	console.log("Clever & smart");

	let entries = [
		'sat-info-title',
		'sat-intl-des',
		'sat-type',
		'sat-apogee',
		'sat-perigee',
		'sat-inclination',
		'sat-altitude',
		'sat-velocity',
		'sat-period'
	];
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.request == "pull data") {
				console.log("message received");
				let data=[];
				entries.forEach( entry => {
					data.push( {
						category: entry,
						content: $('#'+entry).text()
					});
				});
				console.log(entries);
				sendResponse({data});
			}
		}
	);
});