
const binance = require('../node-binance-api.js');
	binance.options({
	  'APIKEY':'<api key>',
	  'APISECRET':'<api secret>'
	});

//var	lst_name_exchange = []; // on le met en globalle pour le remplur facilement
var db_info = {};
var	all_symbole_exchange = [];

var	get_name_promise = new Promise((resolve, reject) => 
{
	let id;
	var	lst_name_exchange = [];
	//Getting bid/ask prices for all symbols
	binance.prices((error, ticker) => {
		id = 0;
		lst_name_exchange = [];
		for (i in ticker)
		{
			lst_name_exchange[id] = i;
			id++;
		}
		all_symbole_exchange = lst_name_exchange;
		resolve(lst_name_exchange);
	});
});

process.on('SIGINT', function() {
	console.log("Caught interrupt signal");
	if (db_info.db !== undefined)
		db_info.db.close;
	process.exit();
});

function	link_websocket_to_db()
{
	// c'est ici ;les baille wesh
}

function	do_nothing(err, res)
{
	if (err)
		throw (err);
	// hey trop bien ;)
}

//	en gros la dernire fonctiona a etreapeler
function	do_something(err, res)
{
	if (err)
	{
		console.log(err);
	//	throw (err);
	}
	console.log("All colleciton created =)");
	binance.websockets.trades(all_symbole_exchange, (trades) => {
		db_info.dbo.collection(trades.s + "_trade").insertOne(trades, do_nothing);
	});

	binance.websockets.depth(all_symbole_exchange, (depth) => {
			db_info.dbo.collection(depth.s + "_depth").insertOne(depth, do_nothing);
	});

	binance.websockets.miniTicker((markets) => {
		for (i in markets)
		{
			db_info.dbo.collection(i + "_ticker").insertOne(markets[i], do_nothing);
		}
	});
	console.log("all biding finised");
}

//	on suprime la db et on reconstruit sa structure
function	db_build(lst_name)
{
	// db_info c'est une variabe globale
	let nb_name = lst_name.length;
	MongoClient = require('mongodb').MongoClient;
	db_info.name = "binance_storage";
	db_info.port = "27017"
	db_info.url = "mongodb://localhost:" + db_info.port + "/" + db_info.name;


	MongoClient.connect(db_info.url, function(err, db) {
		if (err) throw err;
		var dbo = db.db(db_info.name);
		db_info.dbo = dbo;
		db_info.db = db;
	//	dbo.dropDatabase();		// on et pas aubliger de tout detruire a chaque fois

		let i; // pour garder le i en dehors du for
		for (i = 0; i < (nb_name - 1); i++)
		{
			dbo.createCollection(lst_name[i] + "_ticker", do_nothing);
			dbo.createCollection(lst_name[i] + "_trade", do_nothing);
			dbo.createCollection(lst_name[i] + "_depth", do_nothing);
		}
		dbo.createCollection(lst_name[i] + "_ticker", do_nothing);
		dbo.createCollection(lst_name[i] + "_trade",  do_nothing);
		dbo.createCollection(lst_name[i] + "_depth",  do_something);
	});
}

function	exec_process()
{
	get_name_promise.then(db_build); // on est pas trop aubliger de refare sa tout le temps ca prend quasiement 1 minutes
}


exec_process();

//	TODO: faire le truc des nom de collection par type d'objet (ticker, depth, trades)
