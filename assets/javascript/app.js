var portfolio = document.querySelector("#portfolio");
const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");
const messageArea = document.querySelector("#answer");



//toggle elements
const setupUI = (user) => {
    if (user) {
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none");
    } else {
        loggedInLinks.forEach(item => item.style.display = "none");
        loggedOutLinks.forEach(item => item.style.display = "block");
    }
}

//function for counting object length
function countProperties(obj) {
    var count = 0;

    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }

    return count;
}


//display firestoredata in portfolio
const setupStock = (data) => {
    if (data.length) {
        let html = "";

        data.forEach(doc => {
            var date = new Date();
            const stock = doc.data();
            var symbol = stock.symbol;
            var u = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
            $.ajax({
                method: "GET",
                url: u
            }).then(function (response) {
                const displayStock = `
                        <div class="card blue-grey darken-1">
                            <div class="displayStock card-content white-text" id="${response.companyName}">
                                    <h2 class="card-title">${response.companyName}</h2>
                                    <p class="symbols">${response.symbol}</p>
                                    <p class="prices"> $${response.latestPrice}</p>
                                    <p>52 weeks High: $${response.week52High}</p>
                                    <p>52 weeks Low: $${response.week52Low}</p>
                                    <p class="date">${date}</p>
                                        <button id="removeStock">Remove</button>
                            </div>
                        </div>
            `
                html += displayStock;
                //js finding "portfolio" in both html files
                if (portfolio) {
                    portfolio.innerHTML = html;
                }
            }).catch(err => {
                if (err) {
                    var v = symbol.toUpperCase();
                    var w = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
                    $.ajax({
                        method: "GET",
                        url: w
                    }).then(function (data) {
                        for (var i = 0; i < data.cryptocurrenciesList.length; i++) {
                            if (v == data.cryptocurrenciesList[i].ticker) {
                                // place the price on the html of the card
                                const displayStock = `
                <div class="card blue-grey darken-1">
                <div class="displayStock card-content white-text" id="${data.cryptocurrenciesList[i].name}">
                    <h2 class="card-title">${data.cryptocurrenciesList[i].name}</h2>
                    <p class="symbols">${data.cryptocurrenciesList[i].ticker}</p>
                    <p class="prices"> $${data.cryptocurrenciesList[i].price}</p>
                    <p class="date">${date}</p>
                    <button id="removeStock">Remove</button>
                </div>
                </div>
            `
                                html += displayStock;
                                //js finding "portfolio" in both html files
                                if (portfolio) {
                                    portfolio.innerHTML = html;
                                }
                            }
                        }
                    });
                }
            })


        });


    } else {
        if (portfolio) {
            portfolio.innerHTML = "<h1>Please LogIn and/or add a stock into your portfolio</h1>";
        }
    }
}

//function for checkin price of stock
$("#pushStock").on("click", function checkPrice() {
    event.preventDefault();
    var symbol = $("#symbol").val();
    var date = new Date();
    $("#checking").empty();
    var u = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
    $.ajax({
        method: "GET",
        url: u
    }).then(function (response) {
        $("#stockTitle").text(response.companyName);
        $("#stockInfo").empty();
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text("Ticker: " + response.symbol);
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text("Latest price: $" + response.latestPrice);
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text(date);
        var addStock = $("<a>").attr("id", "addStock").text("Add to Portfolio").attr("data-symbol", response.symbol).attr("data-name", response.companyName);
        $(".card-action").empty();
        $(".card-action").append(addStock);

         //create line charts for symbol 
    var points = [];
    var prices = [];
    var w = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + symbol + "&apikey=Q26EYZTYRUMY42LC";
    $.ajax({
        method: "GET",
        url: w
    }).then(response => {
        var childrenCount = countProperties(response["Weekly Time Series"]);
        for (var dates in response["Weekly Time Series"]) {
            var num = parseFloat(response["Weekly Time Series"][dates]["4. close"]);
            prices.unshift(num);
        };

        for (let i = prices.length - 52; i < prices.length; i++) {
            points.push({ y: prices[i] });
        };

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "1 year stock history"
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "line",
                dataPoints: points
            }]
        })
        chart.render();
    })
    var pointsDay = [];
    var w = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=5min&apikey=Q26EYZTYRUMY42LC";

    $.ajax({
        method: "GET",
        url: w
    }).then(response => {
        var childrenCount = countProperties(response["Time Series (5min)"]);

        var pricesDay = [];

        for (var dates in response["Time Series (5min)"]) {
            var num = parseFloat(response["Time Series (5min)"][dates]["4. close"]);
            pricesDay.unshift(num);
        };


        for (let i = 0; i < pricesDay.length; i++) {
            pointsDay.push({ y: pricesDay[i] });
        };

        var chart = new CanvasJS.Chart("chartContainer1", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Today stock history"
            },
            axisY: {
                includeZero: false
            },
            data: [{
                type: "line",
                dataPoints: pointsDay
            }]
        })
        chart.render();
    })

    document.querySelector("#stockSearchForm").reset();
}).catch(err => {
    if (err) {
        var v = symbol.toUpperCase();
        var w = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
        $.ajax({
            method: "GET",
            url: w
        }).then(function (data) {
            
            for (var i = 0; i < data.cryptocurrenciesList.length; i++) {
                if (v == data.cryptocurrenciesList[i].ticker) {
                    // place the price on the html of the card
                    $("#stockTitle").text(data.cryptocurrenciesList[i].name);
                    $("#stockInfo").empty();
                    $("#stockInfo").append("<p>");
                    $("#stockInfo p:last-child").text("Ticker: " + data.cryptocurrenciesList[i].ticker);
                    $("#stockInfo").append("<p>");
                    $("#stockInfo p:last-child").text("Latest price: $" + data.cryptocurrenciesList[i].price);
                    $("#stockInfo").append("<p>");
                    $("#stockInfo p:last-child").text(date);
                    var addStock = $("<a>").attr("id", "addStock").text("Add to Portfolio").attr("data-symbol", data.cryptocurrenciesList[i].ticker).attr("data-name", data.cryptocurrenciesList[i].name);
                    $(".card-action").empty();
                    $(".card-action").append(addStock);
                };
            };
        });
    var points = [];
var prices = [];
var w = "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_WEEKLY&symbol=" + symbol + "&market=USD&apikey=Q26EYZTYRUMY42LC";
$.ajax({
    method: "GET",
    url: w
}).then(response => {
    console.log(response);
    var childrenCount = countProperties(response["Time Series (Digital Currency Weekly)"]);
    for (var dates in response["Time Series (Digital Currency Weekly)"]) {
        var num = parseFloat(response["Time Series (Digital Currency Weekly)"][dates]["4a. close (USD)"]);
        prices.unshift(num);
    };

    for (let i = prices.length - 52; i < prices.length; i++) {
        points.push({ y: prices[i] });
    };

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "1 year stock history"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: points
        }]
    })
    chart.render();
})
    };

    $("#chartContainer1").empty();
    })
    });

   

$(document).on("click", "#addStock", () => {
    if ($("#stockTitle").text() != "Stock Price") {
        db.collection("users").doc(userUID).collection("stocks").doc($("#addStock").attr("data-name")).set({
            symbol: $("#addStock").attr("data-symbol")
        });
    };
});


//automatically checking and changing prices
function uploadStockInfo() {
    var stockSymbol = document.querySelectorAll(".symbols");
    var stockPrice = document.querySelectorAll(".prices");
    var date = new Date();
    var stockLatestDate = document.querySelectorAll(".date");
    var num = $(portfolio).children().length;
    for (let i = 0; i < num; i++) {
        var u = "https://cloud.iexapis.com/stable/stock/" + stockSymbol[i].innerHTML + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
        $.ajax({
            method: "GET",
            url: u
        }).then(function (response) {
            stockPrice[i].innerHTML = response.latestPrice;
            stockLatestDate[i].innerHTML = date;
        }).catch(err => {
            var v = stockSymbol[i].innerHTML.charAt(0).toUpperCase() + stockSymbol[i].innerHTML.slice(1);
            var w = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
            $.ajax({
                method: "GET",
                url: w
            }).then(function (data) {
                    for (var p = 0; p < data.cryptocurrenciesList.length; p++) {
                        if (v == data.cryptocurrenciesList[p].ticker) {
                            // place the price on the html of the card
                            stockPrice[i].innerHTML = data.cryptocurrenciesList[p].price;
                            stockLatestDate[i].innerHTML = date;
                        }
                    }
            });
        });
    };
};

//checking price every 10sec
setInterval(uploadStockInfo, 1000 * 60 * 5);


document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll(".modal");
    if (modals) {
        M.Modal.init(modals);
    }
});

$(document).on("click", "#removeStock", function (e) {
    let suid = e.target.parentElement.getAttribute("id");
    db.collection("users").doc(userUID).collection("stocks").doc(suid).delete();
});

//creating chat
$("#questionSubmit").on("click", () => {
    let message = $("#question").val().trim();
    let messageForm = document.querySelector("#messageForm");
    if (message != "") {
        db.collection("chat").doc().set({
            First_Name: firstName,
            Last_Name: lastName,
            message: message,
            number: counter
        }).then(() => {
            messageForm.reset();
        });
    }
});

//show chat 
const showChat = (data) => {
    counter = data.length;
    let html = "";
    for (let i = 0; i < counter; i++) {
        let userMessage = data[i].data();
        let messageData = `<p>${userMessage.First_Name} ${userMessage.Last_Name}: ${userMessage.message}</p>`;
        html += messageData;
    }

    if (messageArea) {
        messageArea.innerHTML = html;
    }
}