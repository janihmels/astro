function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

let timeInterval, timer, counter, countdown;

$(document).ready(function(){
	counter=0;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {request: "init data"}, function(response) {
			let defaultValue = Math.floor(response.period);
			let html='';
			html+='<h3>';
			response.data.forEach(
				entry => {
					html+=entry.content+" | ";
				}
			);		
			html+='</h3>';
			html+='<h3>Interval (sec): <input id="interval-value" type="text" value="'+defaultValue;
			html+='">&nbsp;<button id="take-reading">Start</button></h3>';
			$("#info-area").html(html);
			$("#take-reading").click(start);
		});
	});
});

const start = ( ) => {
	timeInterval = 1000*parseFloat( $("#interval-value").val() );

	initCountdown();
	setInterval( buttonCountdown, 1000 );
	
	let timer = setInterval( takeReading, timeInterval );
	takeReading();
};

const buttonCountdown = () => {
	$("#take-reading").text( (countdown--)+'' );
}

const initCountdown = () => {
	countdown=Math.ceil(timeInterval/1000);
	buttonCountdown();	
}

const takeReading = () => {
	initCountdown();
	counter++;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {request: "pull data"}, function(response) {
			const thisDate= new Date();
			const timeStr = thisDate.getHours()+":"+thisDate.getMinutes()+":"+thisDate.getSeconds();

			let html='';
			html+="<tr><td>"+counter+"</td><td>"+timeStr+"</td>";

			response.data.forEach(
				entry => {
					html+="<td>"+entry.content+"</td>";
				}
			);

			html+="</tr>";
			$("#data-table").append(html);
		});
	});
};