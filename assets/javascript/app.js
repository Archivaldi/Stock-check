var portfolio = document.querySelector("#portfolio");
//display firestoredata in portfolio
const setupStock = (data) => {
    if (data.length) {
        let html = "";

        data.forEach(doc => {
            const stock = doc.data();
            const displayStock = `
                <div class="displayStock">
                    <h2>${stock.title}</h2>
                    <p>${stock.price}</p>
                </div>
            `
            html += displayStock;
        });

        if (portfolio) {
            portfolio.innerHTML = html;
        }

    } else {
        if (portfolio) {
            portfolio.innerHTML = "<h1>Please LogIn</h1>";
        }
    }
}

//function for checkin price of stock
$("#pushStock").on("click", function checkPrice() {
    var symbol = $("#symbol").val();
    $("#checking").empty();
    // for (var i = 0; i < stocks.length; i++) {
    var u = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_ba9bdda0f20d46cba4e89a3e5a1d5317";
    $.ajax({
        method: "GET",
        url: u
    }).then(function (response) {
        ;
        $("#checking").append("<div>");
        $("#checking div").append("<h2>");
        $("#checking div h2").text(response.companyName);
        $("#checking div").append("<p>");
        $("#checking div p").text("Real Time Price: " + response.iexAskPrice + " Latest price: " + response.latestPrice);
        var addStock = $("<button>").attr("id", "addStock").text("Add to Portfolio").attr("data-price", response.latestPrice).attr("data-name", response.companyName);
        $("#checking div").append(addStock);

    })
    // }
})

$(document).on("click", "#addStock", () => {
    db.collection("stocks").add({
        title: $("#addStock").attr("data-name"),
        price: $("#addStock").attr("data-price")
    });
});
