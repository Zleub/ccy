const binance = require('../node-binance-api.js');
binance.options({
  'APIKEY':'<api key>',
  'APISECRET':'<api secret>'
});


function print_lst_couple(couple)
{
	for (j in couple)
	{
		console.log("\n\n\n		====  TABLE_LEN: ", (5 + j), " ====")
		for (i in couple[j])
		{
			 console.log("table[", j, "][", i, "}: ", couple[j][i])
		}
	}
}

//	le symbole de fin est toujours l'un des 4 BTC, ETH, BNB, USDT
function get_graph(couple)
{
	var	links = [[], [], [], []]; // on a aumoins les 4 case des monnaie reference
	var	graph = {};
	var	ends = [];
	var	mat = [[], [], [], []];
	ends["BTC"] = 0;
	ends["ETH"] = 1;
	ends["BNB"] = 2;
	ends["USDT"] = 3;

	var	symb_id = 4;
	var symbols_rev = [];
	symbols_rev["BTC"] = 0;
	symbols_rev["ETH"] = 1;
	symbols_rev["BNB"] = 2;
	symbols_rev["USDT"] = 3;



	var connexion = [];


	var beg, end1, end2, end, id1, id2;	// les smbole dans le couple d'echange
	for (j in couple)
	{
		for (i in couple[j]) // les couple de taille 6, donc connue
		{
			end2 = couple[j][i].slice(-4);
			end1 = end2.slice(-3);
			if (ends[end1] !== undefined)
			{
				beg = couple[j][i].slice(0, -3);
				end = end1;
			}
			else if (ends[end2] !== undefined)
			{
				beg = couple[j][i].slice(0, -4);
				end = end2;
			}
			else
				continue ;
			id1 = symbols_rev[end];
			id2 = symbols_rev[beg];
			connexion.push([id1, id2]);
			if(links[id2] === undefined)
				links[id2] = [];
			links[id1].push(id2);
			links[id2].push(id1);
			if (mat[id2] === undefined)
				mat[id2] = [];
			mat[id1][id2] = 1;
			mat[id2][id1] = 1;
			if (ends[beg] !== undefined || symbols_rev[beg] !== undefined)
				continue ;
			symbols[symb_id] = beg;
			symbols_rev[beg] = symb_id++;
//			console.log("beg:", beg, "	len:", beg.length, "			end:", end, "	len:", end.length);
		}
	}
	//// on netoie la matrice de connexion
	var len = symbols.length;
	for (j = 0; j < len; j++)
	{
		for (i = 0; i < len; i++)
		{
			if (mat[j][i] === undefined)
				mat[j][i] = 0;
		}
	}
	////
	graph.symb_name2id = symbols_rev;
	graph.symb_id2name = symbols;
	graph.id_conect = connexion;
	graph.links = links;
	graph.mat = mat;
	return (graph);
}


//Getting latest price of all symbols
binance.prices((error, ticker) => {
	 // console.log("prices()", ticker);
	 var couple = [[], [], [], []];
	 var symbols = [];
	 var symbols_rev = [];
	 var len = 0;
	 var groupe = 0;
	 var i = 0, j = 0;
	 for (elem in ticker)
	 {
		// console.log("elem[", i, "]: -> ", elem, "=", ticker[elem]);
		len = elem.length;
		groupe = len - 5;
		couple[groupe].push(elem); 
	//	console.log(i, " ", "len:[", elem, "]: ", elem.length);
		i++;
	 }

//	print_lst_couple(couple);
	symbols_rev = construct_lst_symbole(couple);	// --> on va construire le debut de liste avec des symbole de taille connue // 			et on ne prend pas en conte "123456"
	symbols = construct_symbol_id(symbols_rev);
	for (word in symbols)
	{																
		console.log("id:", word, "-->:", symbols[word]);
	}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
//	    console.log("Price of BTC: ", ticker.BTCUSDT);
});



// Get bid/ask prices
//binance.allBookTickers(function(error, json) {
//  console.log("allBookTickers",json);
//});

//// Getting latest price of a symbol
//binance.prices(function(error, ticker) {
//	console.log("prices()", ticker);
//	console.log("Price of BNB: ", ticker.BNBBTC);
//});
//
//// Getting list of current balances
//binance.balance(function(error, balances) {
//	console.log("balances()", balances);
//	if ( typeof balances.ETH !== "undefined" ) {
//		console.log("ETH balance: ", balances.ETH.available);
//	}
//});

// Getting bid/ask prices for a symbol
//binance.bookTickers(function(error, ticker) {
//	console.log("bookTickers()", ticker);
//	console.log("Price of BNB: ", ticker.BNBBTC);
//});

// Get market depth for a symbol
//binance.depth("SNMBTC", function(error, json) {
//	console.log("market depth",json);
//});

// Getting list of open orders
//binance.openOrders("ETHBTC", function(error, json) {
//	console.log("openOrders()",json);
//});

// Check an order's status
//let orderid = "7610385";
//binance.orderStatus("ETHBTC", orderid, function(error, json) {
//	console.log("orderStatus()",json);
//});

// Cancel an order
//binance.cancel("ETHBTC", orderid, function(error, response) {
//	console.log("cancel()",response);
//});

// Trade history
//binance.trades("SNMBTC", function(error, json) {
//  console.log("trade history",json);
//});

// Get all account orders; active, canceled, or filled.
//binance.allOrders("ETHBTC", function(error, json) {
//	console.log(json);
//});

//Placing a LIMIT order
//binance.buy(symbol, quantity, price);
//binance.buy("ETHBTC", 1, 0.0679);
//binance.sell("ETHBTC", 1, 0.069);

//Placing a MARKET order
//binance.buy(symbol, quantity, price, type);
//binance.buy("ETHBTC", 1, 0, "MARKET")
//binance.sell(symbol, quantity, 0, "MARKET");

//// Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
//binance.candlesticks("BNBBTC", "5m", function(error, ticks) {
//	console.log("candlesticks()", ticks);
//	let last_tick = ticks[ticks.length - 1];
//	let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
//	console.log("BNBBTC last close: "+close);
//});
//
//
//// Maintain Market Depth Cache Locally via WebSocket
//binance.websockets.depthCache(["BNBBTC"], function(symbol, depth) {
//	let max = 10; // Show 10 closest orders only
//	let bids = binance.sortBids(depth.bids, max);
//	let asks = binance.sortAsks(depth.asks, max);
//	console.log(symbol+" depth cache update");
//	console.log("asks", asks);
//	console.log("bids", bids);
//	console.log("ask: "+binance.first(asks));
//	console.log("bid: "+binance.first(bids));
//});
