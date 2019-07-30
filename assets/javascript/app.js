function checkPrice(){
    var symbol = $("input[type=text]").val();
    var u = "https://sandbox.iexapis.com/stable/stock/"+symbol+"/quote?token=Tpk_ac0b33181d2e433d982b32f36d99a02c";
    $.ajax({
        method: "GET",
        url: u
    }).then(function(response){
        $("#nameOfCompany").text(response.companyName);
        $("#price").text(response.latestPrice);
    })
}

setInterval(checkPrice, 5000);