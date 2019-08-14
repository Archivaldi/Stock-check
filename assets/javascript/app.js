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
                    var v = symbol.charAt(0).toUpperCase() + symbol.slice(1);
                    var w = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
                    $.ajax({
                        method: "GET",
                        url: w
                    }).then(function (data) {
                        for (var i = 0; i < data.cryptocurrenciesList.length; i++) {
                            if (v == data.cryptocurrenciesList[i].name) {
                                // place the price on the html of the card
                                const displayStock = `
                <div class="card blue-grey darken-1">
                <div class="displayStock card-content white-text" id="${data.cryptocurrenciesList[i].name}">
                    <h2 class="card-title">${data.cryptocurrenciesList[i].name}</h2>
                    <p class="symbols">${data.cryptocurrenciesList[i].name}</p>
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
        console.log(response);
        $("#stockTitle").text(response.companyName);
        $("#stockInfo").empty();
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text("Latest price: $" + response.latestPrice);
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text(response.latestTime);
        $("#stockInfo").append("<p>");
        $("#stockInfo p:last-child").text(date);
        var addStock = $("<a>").attr("id", "addStock").text("Add to Portfolio").attr("data-symbol", response.symbol).attr("data-name", response.companyName);
        $(".card-action").empty();
        $(".card-action").append(addStock);

    }).catch(err => {
        if (err) {
            var v = symbol.charAt(0).toUpperCase() + symbol.slice(1);
            var w = "https://financialmodelingprep.com/api/v3/cryptocurrencies";
            $.ajax({
                method: "GET",
                url: w
            }).then(function (data) {
                for (var i = 0; i < data.cryptocurrenciesList.length; i++) {
                    if (v == data.cryptocurrenciesList[i].name) {
                        // place the price on the html of the card
                        $("#stockTitle").text(data.cryptocurrenciesList[i].name);
                        $("#stockInfo").empty();
                        $("#stockInfo").append("<p>");
                        $("#stockInfo p:last-child").text("Latest price: $" + data.cryptocurrenciesList[i].price);
                        $("#stockInfo").append("<p>");
                        $("#stockInfo p:last-child").text(date);
                        var addStock = $("<a>").attr("id", "addStock").text("Add to Portfolio").attr("data-symbol", data.cryptocurrenciesList[i].name).attr("data-name", data.cryptocurrenciesList[i].name);
                        $(".card-action").empty();
                        $(".card-action").append(addStock);
                    }
                }
            });
        }
    })
    document.querySelector("#stockSearchForm").reset();
})

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
                if (err) {
                    for (var p = 0; p < data.cryptocurrenciesList.length; p++) {
                        if (v == data.cryptocurrenciesList[p].name) {
                            // place the price on the html of the card
                            stockPrice[i].innerHTML = data.cryptocurrenciesList[p].price;
                            stockLatestDate[i].innerHTML = date;
                        }
                    }
                }
            });
        });
    };
};

//checking price every 10sec
setInterval(uploadStockInfo, 1000*60*5);


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