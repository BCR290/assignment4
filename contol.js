// Javascrpt
"use strict";

// This is a way of styling Javascript I think that it makes the file look
// a lot cleaner and please don't delete it.   
(function() {

	var _url = "https://api.github.com/gists?page=1"; // This is the URL 
	
	// This will be called when the variable is created.
	window.onload = function() {
		makeAjaxCall(_url);

		var selectPageNum = document.getElementById("pageselector");
		selectPageNum.onchange = changePageSize;

		// other variables for other numbers
	}

	var makeAjaxCall = function(url) {
		// build the table
		createTable();

		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.send(null);

		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) { 
					//responseText
					var serverResponse = JSON.parse(request.responseText);
					var gists = serverResponse;
					var gistsArray = [];
					for(var i = 0; i < gists.length; i++){
						var g = new gist(gists[i].url, gists[i].id, gists[i].description);
						gistsArray.push(g);
						g.convertToHtml();
					}    
				} else {
					alert("Error!");
				}
			}
		}
	}

	//object of a gist 
	function gist(url, id, description) {
		this.cellNum = 3;	// number of cells we will create for each gist (subject to change)
		
		this.url = url;		// the URL of the gist
		this.id = id;		// The id number? I don't know if this is needed
		this.description = description;	//The description of the gitst

		// a function for making a gist into an HTML element (part of the table)
		this.convertToHtml = function() {
			// This is called everytime we make an gist...
			var row = document.createElement("tr");
			row.className = "gistRow";
			for (var i = 0; i < this.cellNum; i++) {
				var cell = document.createElement("td");
				cell.className = "cell";
				if (i == 0) {
					cell.innerHTML = this.url;
				} else if (i == 1) {
					cell.innerHTML = this.id;
				} else if (i == 2) {
					cell.innerHTML = this.description;
				}
				row.appendChild(cell);
				document.getElementById("infoTable").appendChild(row);
			}
		}
		// end of function
	}

	//This function changes the page number that we are looking at
	var changePageSize = function() {
		console.log("popp");
		var page = document.getElementById("page_amount").value;
		console.log(page)
		_url = "https://api.github.com/gists" + page;
		console.log(_url);
  		deleteTable();
		makeAjaxCall(_url);
	}

	// This functino creates a table that will get filled with GISTS
	var createTable = function() {
		var table = document.createElement("table"); //making a table
		table.id = "infoTable";
		var infoArea = document.getElementById("infoArea"); // put table on HTML
		infoArea.appendChild(table); 
	}

	// This function delets the table that we created 
	var deleteTable = function() {
		document.getElementById("infoArea").removeChild(document.getElementById("infoTable")); // Deleted the table from the HTML
	}

})();