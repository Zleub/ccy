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


function	print_symbole_name(ticker)
{
	let	i, str = "";

	for (i in ticker)
	{
		str = "\"" + ticker[i].symbol + "\"";
		console.log(str);
	}
}

//		binance.bookTickers((error, ticker) => {
//		//	strategie_cycle(ticker);
//		//	console.log(ticker);
//			print_symbole_name(ticker);
//		//	  console.log("bookTickers()", ticker);
//		//	do_all_the_taf(ticker);
//		});


//binance.websockets.depth(['QTUMUSDT', 'ETHBTC'], (depth) => {
//	  let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
//	    console.log(symbol+" market depth update");
//		  console.log(bidDepth, askDepth);
//});

//binance.websockets.trades(['BNBBTC', 'ETHBTC'], (trades) => {
//	  let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
//	    console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
//});
//



///*

var	all_symbol = ["ETHBTC", "LTCBTC", "BNBBTC", "NEOBTC", "123456", "QTUMETH", "EOSETH", "SNTETH", "BNTETH", "BCCBTC", "GASBTC", "BNBETH", "BTCUSDT",
		"ETHUSDT", "HSRBTC", "OAXETH", "DNTETH", "MCOETH", "ICNETH", "MCOBTC", "WTCBTC", "WTCETH", "LRCBTC", "LRCETH", "QTUMBTC", "YOYOBTC", "OMGBTC",
		"OMGETH", "ZRXBTC", "ZRXETH", "STRATBTC", "STRATETH", "SNGLSBTC", "SNGLSETH", "BQXBTC", "BQXETH", "KNCBTC", "KNCETH", "FUNBTC", "FUNETH",
		"SNMBTC", "SNMETH", "NEOETH", "IOTABTC", "IOTAETH", "LINKBTC", "LINKETH", "XVGBTC", "XVGETH", "CTRBTC", "CTRETH", "SALTBTC", "SALTETH", "MDABTC",
		"MDAETH", "MTLBTC", "MTLETH", "SUBBTC", "SUBETH", "EOSBTC", "SNTBTC", "ETCETH", "ETCBTC", "MTHBTC", "MTHETH", "ENGBTC", "ENGETH", "DNTBTC",
	    "ZECBTC", "ZECETH", "BNTBTC", "ASTBTC", "ASTETH", "DASHBTC", "DASHETH", "OAXBTC", "ICNBTC", "BTGBTC", "BTGETH", "EVXBTC", "EVXETH", "REQBTC",
		"REQETH", "VIBBTC", "VIBETH", "HSRETH", "TRXBTC", "TRXETH", "POWRBTC", "POWRETH", "ARKBTC", "ARKETH", "YOYOETH", "XRPBTC", "XRPETH", "MODBTC",
		"MODETH", "ENJBTC", "ENJETH", "STORJBTC", "STORJETH", "BNBUSDT", "VENBNB", "YOYOBNB", "POWRBNB", "VENBTC", "VENETH", "KMDBTC", "KMDETH", "NULSBNB",
		"RCNBTC", "RCNETH", "RCNBNB", "NULSBTC", "NULSETH", "RDNBTC", "RDNETH", "RDNBNB", "XMRBTC", "XMRETH", "DLTBNB", "WTCBNB", "DLTBTC", "DLTETH",
		"AMBBTC", "AMBETH", "AMBBNB", "BCCETH", "BCCUSDT", "BCCBNB", "BATBTC", "BATETH", "BATBNB", "BCPTBTC", "BCPTETH", "BCPTBNB", "ARNBTC", "ARNETH",
		"GVTBTC", "GVTETH", "CDTBTC", "CDTETH", "GXSBTC", "GXSETH", "NEOUSDT", "NEOBNB", "POEBTC", "POEETH", "QSPBTC", "QSPETH", "QSPBNB", "BTSBTC",
		"BTSETH", "BTSBNB", "XZCBTC", "XZCETH", "XZCBNB", "LSKBTC", "LSKETH", "LSKBNB", "TNTBTC", "TNTETH", "FUELBTC", "FUELETH", "MANABTC", "MANAETH",
		"BCDBTC", "BCDETH", "DGDBTC", "DGDETH", "IOTABNB", "ADXBTC", "ADXETH", "ADXBNB", "ADABTC", "ADAETH", "PPTBTC", "PPTETH", "CMTBTC", "CMTETH",
		"CMTBNB", "XLMBTC", "XLMETH", "XLMBNB", "CNDBTC", "CNDETH", "CNDBNB", "LENDBTC", "LENDETH", "WABIBTC", "WABIETH", "WABIBNB", "LTCETH", "LTCUSDT",
		"LTCBNB", "TNBBTC", "TNBETH", "WAVESBTC", "WAVESETH", "WAVESBNB", "GTOBTC", "GTOETH", "GTOBNB", "ICXBTC", "ICXETH", "ICXBNB", "OSTBTC", "OSTETH",
		"OSTBNB", "ELFBTC", "ELFETH", "AIONBTC", "AIONETH", "AIONBNB", "NEBLBTC", "NEBLETH", "NEBLBNB", "BRDBTC", "BRDETH", "BRDBNB", "MCOBNB", "EDOBTC",
		"EDOETH", "WINGSBTC", "WINGSETH", "NAVBTC", "NAVETH", "NAVBNB", "LUNBTC", "LUNETH", "TRIGBTC", "TRIGETH", "TRIGBNB", "APPCBTC", "APPCETH", "APPCBNB",
		"VIBEBTC", "VIBEETH", "RLCBTC", "RLCETH", "RLCBNB", "INSBTC", "INSETH", "PIVXBTC", "PIVXETH", "PIVXBNB", "IOSTBTC", "IOSTETH", "CHATBTC", "CHATETH",
		"STEEMBTC", "STEEMETH", "STEEMBNB", "NANOBTC", "NANOETH", "NANOBNB", "VIABTC", "VIAETH", "VIABNB", "BLZBTC", "BLZETH", "BLZBNB", "AEBTC", "AEETH",
		"AEBNB", "RPXBTC", "RPXETH", "RPXBNB", "NCASHBTC", "NCASHETH", "NCASHBNB", "POABTC", "POAETH", "POABNB", "ZILBTC", "ZILETH", "ZILBNB", "ONTBTC",
		"ONTETH", "ONTBNB", "STORMBTC", "STORMETH", "STORMBNB", "QTUMBNB", "QTUMUSDT", "XEMBTC", "XEMETH", "XEMBNB", "WANBTC", "WANETH", "WANBNB", "QLCBTC",
		"QLCETH", "SYSBTC", "SYSETH", "SYSBNB"];

var	one_symbol = ["ETHBTC"];

var	symbol_to_id = [];
var	id_to_symbole = [];
var	ticker = [];

function	init_symbole(all_symb)
{
	let	id;

	id = 0;
	for (i in all_symbol)
	{
		symbol_to_id[all_symbol[i]] = id;
		id_to_symbole[id] = all_symbol[i]; // en fait c'est aussi all_symbola mais bon...
		id++;
	}
}

function	describe_depth(symbol, depth)
{
	let i, j, len1, len2, asks_id, bids_id, id_aw, id_ab, id_bb, id_bw;
	let	ret_val = {};

	j = 0;
	asks_id = Object.keys(depth["asks"]);
	bids_id = Object.keys(depth["bids"]);
	asks_id.sort();
	bids_id.sort();
	len1 = Object.keys(depth["asks"]).length - 1;
	len2 = Object.keys(depth["bids"]).length - 1;
	id_aw = Object.keys(depth["asks"])[len1];
	id_ab = Object.keys(depth["asks"])[0];
	id_bb = Object.keys(depth["bids"])[0];
	id_bw = Object.keys(depth["bids"])[len2];
//	console.log("=========================");
//	console.log("symbole:", symbol,	"lastUpdateId:", depth["lastUpdateId"]);
//	console.log("asks_worst:	", id_aw, " ", depth["asks"][id_aw]);
//	console.log("asks_best: 	", id_ab, " ", depth["asks"][id_ab]);
//	console.log("bids_best: 	", id_bb, " ", depth["bids"][id_bb]);
//	console.log("bids_worst:	", id_bw, " ", depth["bids"][id_bw]);
	ret_val.symbol = symbol;
	ret_val.askPrice = parseFloat(id_ab);
	ret_val.bidPrice = parseFloat(id_bb);
	ret_val.askQty = depth["asks"][id_ab];
	ret_val.bidQty = depth["bids"][id_bb];
	ret_val.id_tab = symbol_to_id[symbol];
	return (ret_val);
}

init_symbole();

binance.websockets.depthCache(all_symbol, (symbol, depth) => {
	let ret;
	ret = describe_depth(symbol, depth);
//	console.log("=========================");
//	console.log(ret);
	ticker[ret.id_tab] = ret;

});


//	console.log("symbole:", symbol, "		depth_top:{", depth, ", ", "}");
//	  let bids = binance.sortBids(depth.bids);
//	  let asks = binance.sortAsks(depth.asks);
//	  console.log(symbol+" depth cache update");
//	//  console.log("bids", bids);
//	//  console.log("asks", asks);
//	  console.log("best bid: "+binance.first(bids));
//	  console.log("best ask: "+binance.first(asks));
