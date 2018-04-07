const binance = require('../node-binance-api.js');
binance.options({
  'APIKEY':'<api key>',
  'APISECRET':'<api secret>'
});

var	lst_name_exchange = [];
var	mongo_db;
var MongoClient;
var mongo_db_url;
var mongo_db_port;
var	dbo;

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
		var	dbo;
		for (i in ticker)
		{
			lst_name_exchange[id] = i;
			id++;
		}
	});
}
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$



////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////           //////////////////////////////////////////////////////////////
///////////////////////////   Frame   //////////////////////////////////////////////////////////////
///////////////////////////           //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////



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
	//		dbo.dropDatabase();
			db.close();

		});

//	var	str_log = "";

	// on cree la DB: binance_storage
	MongoClient.connect(mongo_db_url, function(err, db) {
		if (err) throw err;
		console.log("Database: ", mongo_db_name, " created!");
			db.close();
	});
		MongoClient.connect(mongo_db_url, function(err, db) {
			if (err) throw err;
//			dbo = db.db(mongo_db_name);
			
			for (i in lst_name)
			{
				dbo.createCollection(lst_name[i], function (){
					if (err) throw err;
				});
				console.log("collection[", i, "]:", lst_name[i]);
			}
			db.close();
		});

//	console.log(str_log);
	// oncree les collection: tout les cours different
}

function	get_frame(all_market)
{
//	MongoClient.connect(mongo_db_url, function(err, db) {
//		if (err) throw err;
//		dbo = db.db(mongo_db_name);
//
//		var myobj = { name: "Company Inc", address: "Highway 37" };	// mes baill
//
//		dbo.collection("customers").insertOne(myobj, function(err, res) {if (err) throw err;db.close();});
//	});
//	





	// on etablie les websockette et on regardesi on peu faire des truc apres
	binance.websockets.trades(all_market, (trades) => {

		MongoClient.connect(mongo_db_url, function(err, db) {
			if (err) throw err;
		//	dbo = db.db(mongo_db_name);
		
			dbo.collection(trades.s).insertOne(trades, function(err, res) {
				if (err) throw err;
				db.close();
			});
		});

//		MongoClient.connect(mongo_db_url, function(err, db) {
//			if (err) throw err;
//			dbo = db.db(mongo_db_name);
//			dbo.collection(trades.s).insertOne(trades, function(err, res) {if (err) throw err;db.close();});
//		});
	});


	//
	binance.websockets.miniTicker(markets => {
			MongoClient.connect(mongo_db_url, function(err, db) {
				if (err) throw err;
		//		dbo = db.db(mongo_db_name);
						
				for (i in markets)
				{
					dbo.collection(i).insertOne(markets[i], function(err, res) {
						if (err) throw err;
						db.close();
					});
				}
				db.close();
			});
		//	console.log(markets);
	});


	//	on essera de le faire avec update cahe
	//
	binance.websockets.depth(all_market, (depth) => {
		MongoClient.connect(mongo_db_url, function(err, db) {
			if (err) throw err;
		//	dbo = db.db(mongo_db_name);
		
			dbo.collection(depth.s).insertOne(depth, function(err, res) {
				if (err) throw err;
				db.close();
			});
		});
	});
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
	setTimeout(function() {	everithing(lst_name_exchange);	}, 400); // <--- bahh c'est super trop sale
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
