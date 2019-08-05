var firebaseConfig = {
    apiKey: "AIzaSyCF0HvWofipxbCwadEyr8aQERIXe9WGr2s",
    authDomain: "stock-check-e6ce3.firebaseapp.com",
    databaseURL: "https://stock-check-e6ce3.firebaseio.com",
    projectId: "stock-check-e6ce3",
    storageBucket: "",
    messagingSenderId: "404498187663",
    appId: "1:404498187663:web:552ae95ccb695dcd"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var stocks = [];

$("#pushStock").on("click", function() {
    var symbol = $("input[type=text]").val();
    stocks.push(symbol);
    $("#stocks").append("<button>");
    $("#stocks button:last-child").text(symbol);
})

function checkPrice(){
    $("#checking").empty();
    for(var i = 0; i < stocks.length; i++){
        var symbol = stocks[i];
        var u = "https://cloud.iexapis.com/stable/stock/"+symbol+"/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
        $.ajax({
            method: "GET",
            url: u
        }).then(function(response){
            $("#checking").append("<h2>");
            $("#checking h2:last-child").text(response.companyName);
            $("#checking").append("<p>");
            $("#checking p:last-child").text("Real Time Price: "+response.iexAskPrice +" Latest price: "+ response.latestPrice);
    
        }) 
    }
}

setInterval(checkPrice, 5000);
