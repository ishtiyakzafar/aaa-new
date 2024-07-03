var serverName = 'https://newsiifl.trendlyne.com/';	//using LIVE url -- 'https://client.trendlyne.com/'//UAT
//elements[i].addEventListener('click', function (event) {
var stockCode = localStorage.getItem('stockDetails') ? JSON.parse(localStorage.getItem('stockDetails')).stockCode : "{}";
var currentPrice = localStorage.getItem('stockDetails') ? JSON.parse(localStorage.getItem('stockDetails')).currentValue : "{}";
// var footer = "<div class='pull-xs-right'><button type='button' id='btnBuyPlace' onclick=CallBuyFnc(); class='btn btn-success'>Buy</button><button type='button' id='btnSellPlace' onclick=CallSellFnc(); class='btn btn-danger'>Sell</button></div>";
var footer = "";
var loadTLSummary = function (i) {
    return function () {
        if (i >= 5) {
            if (typeof TLSummary === 'undefined') console.log('File not found');
            return;
        }
        if (typeof TLSummary !== 'undefined') {
            TLSummary.triggerSummaryModal(stockCode, currentPrice, footer, serverName);
        } else {
            setTimeout(loadTLSummary(++i), 1000); // 1 sec delay for later timeouts
        }
    }
}
setTimeout(loadTLSummary(0), 0); // 1 sec delay first time
/* for modal / popup */
TLSummary.triggerSummaryModal(stockCode, currentPrice, footer, serverName, "swot");