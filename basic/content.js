$(document).ready(function() {
	console.log("Clever & smart");

	let dataEntries = [
//		'sat-info-title',
//		'sat-intl-des',
//		'sat-type',
		'sat-apogee',
		'sat-perigee',
		'sat-inclination',
		'sat-altitude',
		'sat-velocity',
		'sat-period'
	];

	let startEntries = [
		'sat-info-title',
		'sat-intl-des',
		'sat-type',
		'sat-period'
	];
	
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {

			if (request.request == "pull data") {
				let data=[];
				dataEntries.forEach( entry => {
					data.push( {
						category: entry,
						content: $('#'+entry).text()
					});
				});				
				sendResponse({data});
			}

			if (request.request == "init data") {
				let data=[];
				startEntries.forEach( entry => {
					data.push( {
						category: entry,
						content: $('#'+entry).text()
					});
				});				
				sendResponse({data, period: parseFloat($("#sat-period").text())});
			}
			
		}
	);
});