// Javascrpt
"use strict";

//Ok 
(function() {
	var _url = "https://api.github.com/gists/";
	

	window.onload = function() {
		makeAjaxCall(_url);

		var selectPageNum = document.getElementByName("pages");
		selectPageNum.onclick = changePageSize();

		// other variables for other numbers
	}

	var makeAjaxCall = function(url) {
		// build the table
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.send(null);

		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) { 
					//responseText
					var serverResponse = JSON.parse(request.responseText);
					var gists = serverResponse.array;
					var gistsArray = [];
					for(var i=0;i<memes.length;i++){
						var m = new meme(memes[i].name, memes[i].url);
						memeArray.push(m);
						m.convertToHtml();
					}     
				} else {
					alert("Error!");
				}
			}
		}
	}

	function gists()

}();