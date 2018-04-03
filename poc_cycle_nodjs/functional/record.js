const binance = require('../node-binance-api.js');
binance.options({
  'APIKEY':'<api key>',
  'APISECRET':'<api secret>'
});

var	lst_name_exchange = [];
var	mongo_db;
var	dbo;
var MongoClient;
var mongo_db_url;
var mongo_db_port;

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//	get liste of echange symbole
//		--> le taf ...
function	get_all_symbole_exchange()
{
	let id;
	//Getting bid/ask prices for all symbols
	binance.prices((error, ticker) => {
		id = 0;
		lst_name_exchange = [];
		for (i in ticker)
		{
			lst_name_exchange[id] = i;
			id++;
		}
	});
}

function	db_init(lst_name)
{
	//	on metra tout ca dans un objet bien unifier tout ca samere
	MongoClient = require('mongodb').MongoClient;
	mongo_db_name = "binance_storage";
	mongo_db_port = "27017"
	mongo_db_url = "mongodb://localhost:" + mongo_db_port + "/" + mongo_db_name;

	MongoClient.connect(mongo_db_url, function(err, db) {
		if (err) throw err;
		dbo = db.db(mongo_db_name);
		
		for (i in lst_name)
		{
			let name = 	lst_name[i] + "/trade";
			// on pourrai rajouter des itinialisation de parametre pour dire qu'on veux bien que il s'index lui emem totu ca
			dbo.createCollection(name, function (){if (err) throw err;});
		  name = lst_name[i] + "/ticker";
			dbo.createCollection(name, function (){if (err) throw err;});
		  name = lst_name[i] + "/depth";
			dbo.createCollection(name, function (){if (err) throw err;});
		}
		db.close();
		console.log("all collection initialized");

	});
}

function	get_frame(all_symbol)
{

	// websockets (TRADES) => mongoDB
	binance.websockets.trades(all_symbol, (trades) => {
		connect.log(trades);
			let name = trades.s + "/trade";
			console.log("			", name);
			dbo.collection(name).insertOne(trades, function(err, res) {if (err) throw err;db.close();});
	});

//	// websockets (miniTICKER) => mongoDB
//	binance.websockets.miniTicker(markets => {
//		MongoClient.connect(mongo_db_url, function(err, db) {
//			if (err) throw err;
//			var dbo = db.db(mongo_db_name);
//			for (i in markets)
//			{
//				// ici on pourrai gerer une exeption si le marcher de markets n'existe pas... mais comme partout ailleur
//				console.log("i:", i);
//				let name = "" + i + "/ticker";
//			//	dbo.collection(name).insertOne(markets, function(err, res) {if (err) throw err;});
//			}
//db.close();
//			 // il se peut que ca ne derange pas qu'il soit debancher a la fin... 
//		});
//	});
//
//	// websockets (depth[bid, ask]) => mongoDB
//	binance.websockets.depth(all_symbol, (depth) => {
//		MongoClient.connect(mongo_db_url, function(err, db) {
//			if (err) throw err;
//			var dbo = db.db(mongo_db_name);
////			dbo.collection(depth.s + "/depth").insertOne(markets, function(err, res) {if (err) throw err;db.close();});
//		});
//	});
}

function	everithing(lst_name)
{
	db_init(lst_name);
	get_frame(lst_name);
	console.log("\t\t\t\t\t\t\t\t\t\t\tend of code =)");
	// try get frame
	// construct frame
	// test put somting
}

function	test_algo()
{
	let	i, lst_name;	
	
	get_all_symbole_exchange();
	setTimeout(function() {	everithing(lst_name_exchange);	}, 1000); // <--- bahh c'est super trop sale
	console.log("after the end?");
}

/* // Get Trade Updates via WebSocket
binance.websockets.trades(['BNBBTC', 'ETHBTC'], (trades) => {
  let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
  console.log(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
});
*/


/* // Get miniTicker via WebSocket ==> cours/last-trade }-> aglomerate for frame compatibilities 
binance.websockets.miniTicker(markets => {
  console.log(markets);
});
*/

/* // Get Market Depth (updated) via WebSocket }-> s'annulle avec les trade update?
binance.websockets.depth(['BNBBTC'], (depth) => {
  let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
  console.log(symbol+" market depth update");
  console.log(bidDepth, askDepth);
});
*/

test_algo();
