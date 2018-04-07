
var	mongo_info = {	db_name : "",
					url : "",
					port : "",
					mongo_client : {}, // enfait celuila ps sur
					dbo : {}
				};

function	mongo_init_connexion()
{
	mongo_info.db_name = "binance_storage";
	mongo_info.port = "27017"; // On pourrais immaginer un truc dans une variable d'invironnement ou what ever au cas ou ca change
	mongo_info.url = "mongodb://localhost:" + mongo_info.port + "/" + mongo_info.name;

	
}
