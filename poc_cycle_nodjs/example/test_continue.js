const binance = require('../node-binance-api.js');
binance.options({
  'APIKEY':'<api key>',
  'APISECRET':'<api secret>'
});

/*
Placing a LIMIT order

var quantity = 1, price = 0.069;
binance.buy("ETHBTC", quantity, price);
binance.sell("ETHBTC", quantity, price);

Placing a MARKET order

// These orders will be executed at current market price.
// var quantity = 1;
// binance.marketBuy("BNBBTC", quantity);
// binance.marketSell("ETHBTC", quantity);

*/

//binance.websockets.miniTicker(markets => {
//	  console.log(markets);
//});
//

binance.websockets.depth(['QTUMUSDT', 'ETHBTC'], (depth) => {
	  let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
	    console.log(symbol+" market depth update");
		  console.log(bidDepth, askDepth);
});

//binance.websockets.trades(['BNBBTC', 'ETHBTC'], (trades) => {
//	  let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
//	    console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
//});
