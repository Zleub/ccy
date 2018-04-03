var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var	MongoClient = require('mongodb').MongoClient;
var	mongo_db_name = "binance_storage";
var	mongo_db_port = "27017"
var	mongo_db_url = "mongodb://localhost:" + mongo_db_port + "/" + mongo_db_name;
var mongo_db_collection = "ETHBTC";


MongoClient.connect(mongo_db_url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(mongo_db_name);
  var query = { s: "ETHBTC" };
  dbo.collection(mongo_db_collection).find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
}); 
