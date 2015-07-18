// Javascrpt
//"use strict";
 
// This is a way of styling Javascript numOfAjaxCalls think that it makes the file look
// a lot cleaner and please don't delete it.  
(function() {

    var _url = "30_gists.txt"
    //var _url = "https://api.github.com/gists"; // This is the URL
    var callCount = 0;      // The amount of calls that has been made in the doEveryThing funciton
    window.gistsArray = new Array(); // The array with all the gists
    var numOfAjaxCalls;     // The number of Ajax calls
    var favoriteArray = [];

    // This will be called when the variable is created.
    window.onload = function() {
        var pages = ["?page=1", "?page=2", "?page=3", "?page=4", "?page=5"];
        for (numOfAjaxCalls = 0; numOfAjaxCalls < pages.length; numOfAjaxCalls ++) {
            var theurl = _url + pages[numOfAjaxCalls ];
            makeAjaxCall(_url);             //Makes the ajax calls and fills THIS NEEDS TO BE CHANGED
        }

        var selectPageNum = document.getElementById("pageselector");
        selectPageNum.onchange = changePageSize;

        var searcher = document.getElementById("searchButton");
        searcher.onclick = searchArray;
        
        if (localStorage.getItem("favorites") != null) {
            loadfavorites;
        }

    }


    var searchArray = function (){
        deleteTable();
        var table = document.createElement("feildset"); //making a table
        table.id = "infoTable";
        var infoArea = document.getElementById("infoArea"); // put table on HTML
        infoArea.appendChild(table);
        for (var x = 0; x < gistsArray.length; x ++){
            if (gistsArray[x].description == document.getElementById("searchText").value) {
                gistsArray[x].convertToHtml("infoTable");
            }
        }
    }

    var loadfavorites = function(){
        if (document.getElementById("favoriteGist") != null) {
            deleteFavs();
        }
        
        favoriteArray = JSON.parse(localStorage.getItem("favorites"));
        if (favoriteArray == null) {
            localStorage.setItem("favorites", JSON.stringify(favoriteArray));
        }
        favoriteArray = JSON.parse(localStorage.getItem("favorites"));
        //console.log(favoriteArray.length);
        
        var holder = document.createElement("div");
        holder.id = "favoriteGist";
        for(var q = 0; q < favoriteArray.length; q++){
            console.log("creating favorites: " + favoriteArray[q]);

            var oneFavorite = document.createElement("div");
            oneFavorite.className = "favoriteOne";
            if (favoriteArray[q].description == "No description given") {
                oneFavorite.innerHTML = "<a href=\"" + favoriteArray[q].html_url + "\">" +  favoriteArray[q].html_url + "</a>";
            } else { 
                oneFavorite.innerHTML = "<a href=\"" +favoriteArray[q].html_url + "\">" +  favoriteArray[q].description + "</a>";
            }

            var deleteFavoreite = document.createElement("Button");
            deleteFavorite.className = "btn btn-danger pull-right";
            deleteFavorite.innerHTML = "Favorite This Gist";
                        
            holder.appendChild(oneFavorite);
            
        }
        document.getElementById("favoritesbar").appendChild(holder);
    }

    var deleteFavs = function() {
        document.getElementById("favoritesbar").removeChild(document.getElementById("favoriteGist"));
    } 

    //This is after the ajax call...
    var doEveryThing = function() {
        if (callCount > 0) {
            deleteTable();
        }
        createTable(document.getElementById("page_amount").value);
        callCount++;
    }

    var addToArray = function(g) {
        gistsArray.push(g);
    }

    var makeAjaxCall = function(url) {
        //console.log("ajax");
        var request = new XMLHttpRequest();
        console.log(url);
        request.open("GET", url, true);
        request.send(null);
       
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var gists = JSON.parse(request.responseText);
                    for (var j = 0; j < gists.length; j++) {
                        var g = new gist(gists[j].url, gists[j].description, gists[j].html_url);
                        gistsArray.push(g);    
                    }
                    doEveryThing();
                } else {
                    alert("Error!");
                }
            }
        }
    }

    //object of a gist
    function gist(url, description, html) {
        this.cellNum = 2;       // number of cells we will create for each gist (subject to change)
       
        this.url = url;         // the URL of the gist
        //this.id = id;           // The id number? numOfAjaxCalls don't know if this is needed
        this.description = description; //The description of the gitst
        this.html_url = html;

        // a function for making a gist into an HTML element (part of the table)
        this.convertToHtml = function(place) {
            //var table = document.getElementById("gistlist");      
            //console.log("html");
            // This is called everytime we make an gist...
            var row = document.createElement("div");
            row.className = "gistRow";
            for (var t = 0; t <= this.cellNum; t++) {
                var cell = document.createElement("div");
                cell.className = "cell";
                if (t == 0) {
                    
                    var gistURL = this.url;
                    var gistDesc = this.description;
                    var gistHTML = this.html_url;
                    var savedGist = new gist(gistURL, gistDesc, gistHTML); 
                    //console.log("1 " + gistID)
                    var taskRemove = document.createElement("Button");
                    taskRemove.className = "btn btn-danger pull-right";
                    taskRemove.innerHTML = "Favorite This Gist";
                    //taskRemove.setAttribute("gistID", this.id);
                    taskRemove.onclick = function() {
                        console.log("2 " + gistURL);
                        favoriteArray.push(savedGist);
                        localStorage.setItem("favorites", JSON.stringify(favoriteArray));
                        //console.log("pop");
                        loadfavorites();
                    }
                    cell.appendChild(taskRemove);
                } else if (t == 1) {
                        cell.innerHTML = "<span class=\"info\">URL:</span> " + this.url;
                } else if (t == 2) {
                    if(this.description == "") {
                        this.description = "No description given";
                    }
                    cell.innerHTML = "<span class=\"info\">HTML:</span> <a href=\"" + this.html_url + "\">" + this.description + "</a>";
                }
                row.appendChild(cell);
            }
            document.getElementById(place).appendChild(row);
        }
        // end of function
    }


    //This function changes the page number that we are looking at
    var changePageSize = function() {
                //document.getElementById("searchText").value = "";
        var page = document.getElementById("page_amount").value;
        deleteTable();
        createTable(page, gistsArray);
    }

    // This functino creates a table that will get filled with GISTS
    var createTable = function(page) {
        //console.log(page);
        var table = document.createElement("feildset"); //making a table
        table.id = "infoTable";
        var infoArea = document.getElementById("infoArea"); // put table on HTML
        infoArea.appendChild(table);
        for (var w = (page * 30); w < ((page * 30) + 30); w++) {
            //console.log("bleh");
            //  console.log(gistsArray[w]);
            if (gistsArray[w] !== 'undefined')        
               gistsArray[w].convertToHtml("infoTable");
        }
    }

    // This function delets the table that we created
    var deleteTable = function() {
        document.getElementById("infoArea").removeChild(document.getElementById("infoTable")); // Deleted the table from the HTML
    }
 
})();