var portfolio = document.querySelector("#portfolio");
//display firestoredata in portfolio
const setupStock = (data) => {
    if (data.length) {
        let html = "";

        data.forEach(doc => {
            const stock = doc.data();
            ////////////////
            //make app dynamic
            var symbol = stock.symbol;
            var u = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
            $.ajax({
                method: "GET",
                url: u
            }).then(function (response) {
                const displayStock = `
                <div class="displayStock">
                    <h2>${response.companyName}</h2>
                    <p class="symbols">${response.symbol}</p>
                    <p class="prices">${response.latestPrice}</p>
                    <p>${response.latestTime}</p>
                </div>
            `
                html += displayStock;
                //js finding "portfolio" in both html files
                if (portfolio) {
                    portfolio.innerHTML = html;
                }
            })
            //////////////////

        });


    } else {
        if (portfolio) {
            portfolio.innerHTML = "<h1>Please LogIn and/or add a stock into your portfolio</h1>";
        }
    }
}

//function for checkin price of stock
$("#pushStock").on("click", function checkPrice() {
    var symbol = $("#symbol").val();
    $("#checking").empty();
    var u = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
    $.ajax({
        method: "GET",
        url: u
    }).then(function (response) {
        console.log(response);
        $("#checking").append("<div>");
        $("#checking div").append("<h2>");
        $("#checking div h2").text(response.companyName);
        $("#checking div").append("<p>");
        $("#checking div p:last-child").text("Real Time Price: " + response.iexAskPrice + " Latest price: " + response.latestPrice);
        $("#checking div").append("<p>");
        $("#checking div p:last-child").text(response.latestTime);
        var addStock = $("<button>").attr("id", "addStock").text("Add to Portfolio").attr("data-symbol", response.symbol).attr("data-name", response.companyName);
        $("#checking div").append(addStock);
    })
})

$(document).on("click", "#addStock", () => {
    db.collection("users").doc(userUID).collection("stocks").doc($("#addStock").attr("data-name")).set({
        symbol: $("#addStock").attr("data-symbol")
    });
});


//automatically checking and changing prices
function uploadStockInfo() {
    var stockSymbol = document.querySelectorAll(".symbols");
    var stockPrice = document.querySelectorAll(".prices");
    var num = $(portfolio).children().length;
    for (let i = 0; i < num ; i++) {
        var u = "https://cloud.iexapis.com/stable/stock/" + stockSymbol[i].innerHTML + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
        $.ajax({
            method: "GET",
            url: u
        }).then(function (response) {
            stockPrice[i].innerHTML = response.latestPrice;
        });
    };
};

setInterval(uploadStockInfo, 10000);