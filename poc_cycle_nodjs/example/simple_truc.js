const binance = require('../node-binance-api');
binance.options({
	  APIKEY: '<key>',
	    APISECRET: '<secret>',
		  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
		    test: true // If you want to use sandbox mode where orders are simulated
});

binance.bookTickers((error, ticker) => {
	  console.log("bookTickers", ticker);
});
