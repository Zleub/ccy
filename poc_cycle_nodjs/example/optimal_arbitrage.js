// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   optimal_arbitrage.js                               :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: fjanoty <marvin@42.fr>                     +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2018/03/23 00:27:38 by fjanoty           #+#    #+#             //
//   Updated: 2018/03/28 09:24:10 by fjanoty          ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const binance = require('../node-binance-api.js');
binance.options({
  'APIKEY':'<api key>',
  'APISECRET':'<api secret>'
});


var tax = 0.9985;
var tax_bnb = 0.9995;
var	crypto_nb = 0;
var	name_to_id = [];
var id_to_name = [];
var	centre_name = [];

var	link_nb = 0;
var	lst_link_id = [];
var	lst_link_name = [];

var	mat_connexion = [];
var	mat_bid_ask = [];
var	mat_volume = [];

var	lst_equivalent = [];
var lst_cycle = [];

var all_cycle = [];			// la liste de tout les cycle concernant les crypto [C]entral et donc enfait ses chemin equivalent [taille du cycle][id_cycle][liste des point parcouru]

var	interne_couples = [];			// la lite des connexion intern --> en fait juste une matrice 4 x 4, donc leur valeur
var interne_couples_link = []		// le truc qui passe
var	list_cycle = [];				// [lenght][lst] = [id1, id2, id3]; 

//		{id_inter, v1, v2, gain}

function	init_name()
{
	name_to_id["USDT"] = 0;
	name_to_id["BTC"] = 1;
	name_to_id["ETH"] = 2;
	name_to_id["BNB"] = 3;

	id_to_name = ["USDT", "BTC", "ETH", "BNB"];

	centre_name["USDT"] = 0;
	centre_name["BTC"] = 1;
	centre_name["ETH"] = 2;
	centre_name["BNB"] = 3;

	crypto_nb = 4;
}

function get_crypto_name(couple)
{
	let	name = {target:"", ref:""};
	let end1;
	let	len;

	end1 = couple.slice(-3);
	if (centre_name[end1] == undefined)
	{
		end1 = couple.slice(-4);
		if (centre_name[end1] == undefined) // les cas un peu bizar
		{
		//	console.log("error===>", end1);
			return (undefined);
		}
	}
	len = couple.length - end1.length;
	name.target = couple.slice(0, len);
//	console.log("target:[", name.target, "]", "			couple:", couple, "	len_max:", ((couple).length), "	len_sub:", (end1.length),"		len_diff:", len);
//	console.log("type(couple)");
	name.ref = end1;
	return (name);
}

//	On a en entrer la list des couples de monnaie echangeable
//	avec la valeur et la quantiter du bid et du ask.
//	- On va definir la liste des nom possible les tableau qui font correspondre une 'ID' a un 'nom' et vis vers ca
//	- On va aussi cree un tableau de couple d' Id qui corresponde aux monnaie echanger pou faire plus tard la matrice adjacente des connexion
function	forge_the_names_and_links(bid_ask)
{
	var name = {};
	for (id in bid_ask)
	{
		name = get_crypto_name(bid_ask[id].symbol);
//		console.log("name:", name);
		if (name == undefined)
		{
		//	console.log("						C'EST LA GUERRE!");	// 	On est dans le cas ou on ne reconnait pas un truc valid. Donc la monnaie de reference est invalide.
			continue ;
		}
		if ((name_to_id[name.target]) === undefined)
		{
			name_to_id[name.target] = crypto_nb;
			id_to_name[crypto_nb] = name.target;
			crypto_nb++;
//			console.log("add crypto:", crypto_nb);
		}

		let id_from, id_to;
		id_from = name_to_id[name.ref];
		id_to = name_to_id[name.target];
		lst_link_id[link_nb] = {from : id_from, to : id_to};
		lst_link_name[link_nb] = {from : name.ref, to : name.truc};
		link_nb++;
	}
}


//	On va remplir d 0 la matrice de connexion et sont equivalent pour les valeur d'echange (bid,ask)
function	matrix_init_connecion_bidask_volume()
{
	for (j = 0; j < crypto_nb; j++)
	{
		mat_connexion[j] = [];
		mat_bid_ask[j] = [];
		mat_volume[j] = [];
		for (i = 0; i < crypto_nb; i++)
		{
			mat_connexion[j][i] = 0;
			mat_bid_ask[j][i] = 0;
			mat_volume[j][i] = 0;
		}
	}
}



//	On va initialiser mat_connexion et mat_bid_ask a 0
//	- on va mettre des 1 pour chaque connexion 																				-> dans mat_connexion
//	- on va metre le ratio de convertion d'une monnaie a l'autre (donc le bid avec C->P,  (1.0 / ask) avec P->C)			-> dans mat_bid_ask
function	make_bid_ask_matrix_lstlink_volume(ticker, lst_link)
{
	let id1, id2;
	var	name = {from:"", to:""};	
	var id = {from:-1, to:-1};

	matrix_init_connecion_bidask_volume();	// on initialise les tableau sur lequel on va travailer
	//	on enregister toute es connexion par un un aux croisement de la colone i et la ligne j
	//	Ca permet d'estimet le nombre de conexiion qui existe entre deux neoeud quand on calcule une puissance de cette matrice
	for (id in lst_link) // On remplis la matrice adjacente
	{
		id1 = lst_link[id].from;								// crypto [C]entral 
		id2 = lst_link[id].to;									// crypto [P]eriferique
		mat_connexion[id1][id2] = 1;	
		mat_connexion[id2][id1] = 1;	
	}
	//	On fait la meme chose mais cette fois on enregistre la valeur de l'echange et le volume, on pourrait mettre toute les valeur dans un tableua d;objet mais... fleme de tout changer
	for (id in ticker) // la on fait la meme chose sauf qu'on va iterer sur les nom des monnaie
	{
		name = get_crypto_name(ticker[id].symbol);	// name.ref => monaie [C]entral  && name.target => monaie [P]eriferique
		if (name == undefined)
			continue ;
		id1 = name_to_id[name.ref];
		id2 = name_to_id[name.target];
		mat_bid_ask[id1][id2] = ticker[id].askPrice * ((id1 == 3) ? tax_bnb : tax);			// C -> P: ask 
		mat_bid_ask[id2][id1] = 1.0 / (ticker[id].bidPrice) * ((id1 == 3) ? tax_bnb : tax);    	// P -> C: bid
		mat_volume[id1][id2] =  ticker[id].askQty;// volume of ask
        mat_volume[id2][id1] = 	ticker[id].bidQty;// volume of bid
//		console.log("===> ", ticker[id]);
	}
}

//	On donne en entree  la matrice de connection.
//	Pour chaque connexion possible entre deux monnaie different:
//		on va definir la liste des chemin equivalent e cette connexion.
//		Pour chaqu'une de ces connexion (A->B != B->A), on va chercher quelle chemin equivalent est le plus rentable
//	
function	make_equivalent_path(mat_conect)
{
	let i, j, k, id;
	// on va d'abord lister tout les chemin equivalent des crypto [C]entral
	//		C'est toute les association de deux nombre compris entre 0 et 3 inclus dont les deux nombre sont different
	// ici on va faire des liste des crypto [P]eripherique qui sont eligible a l'euivalence d'une conexion de crypto [C]entral

	for (j = 0; j < 4; j++)
	{
		lst_equivalent[j] = [];
		for (i = 0; i < 4; i++)
		{
			lst_equivalent[j][i] = [];
			if (i == j)
				continue ;
			// --> la on va chercher pour toute les monnaie celle qui sont conecter a [i] et a [j]
			id = 0;
			for (k = 4; k < crypto_nb; k++) // on ne cherche pas dans les parent, on pourrais mais non
			{
				if (mat_conect[k][i] == 1 && mat_conect[k][j]) // on a bien les baille
				{
					lst_equivalent[j][i][id] = k;
					id++;
				}
			}
		}
	}
}


//	on ne prend pas en conte les valeur undefined
function	eval_path(path, mat)
{
	let	i, len, sum;

	sum = 1;
	len = path.length - 1;
	if (path === undefined)
	{
	//	console.error("				eval_path:	path undefined");
		return (0);
	}
	for (i = 0; i < len; i++)
	{
		if (path[i] === undefined)
		{
			console.error("				eval_path[", i, "]:	is undefined");
			return (0);
		}
//		console.log("path===>", path);
		sum *= mat[path[i]][path[i + 1]];
	}
	return (sum);
}


//	pour chaque connexion entre monaie centrale: on fait la liste de toute les monnai periferique qui sont un intermediaire potentiel de la conexion.
//		En mode simple	-> on cherche la meilleur alternative
//		papl		  	-> on tris toute les solution
//		papl2			-> on ajoute le volume. mais toujours sur la premiere offre
//		papl3			-> on stoque la liste des intermediaire pour un certain volume et un certain prix.
function	find_best_equivqlent(lst_equi, mat_price)
{
	var	best_equivalent = [];
	let	best_price, best_id, path, tmp_val;

	for (j = 0; j < 4; j++)
	{
		best_equivalent[j] = [];
		for (i = 0; i < 4; i++)
		{
			best_equivalent[j][i] = undefined;
			if (i == j)
				continue ;
			// --> la on va chercher pour toute les monnaie celle qui sont conecter a [i] et a [j]
			best_price = mat_price[j][i];
			best_id = undefined;
			
			for (k in lst_equi[j][i]) // on ne cherche pas dans les parent, on pourrais mais non
			{
				path = [j, lst_equi[j][i][k], i];
				tmp_val = eval_path(path, mat_price);
//				console.log("path evaluated:", path, "		tmp_val:", tmp_val);
				if (tmp_val > best_price)
				{
					best_price = tmp_val;
					best_id = k;
				}
			}
			best_equivalent[j][i] = best_id;
		}
	}
	return (best_equivalent);
}

//	en gros on renvoie la matrice des connection des prix entre
//	les quatre monnai centrale mais avec leur pris remplacer par leur meilleur equivalent
//	On aurrai pu set les valeur dans la fonciton d'audessu mais on ne peu pas renvoyer 2 valeur du coupm flem d'autrement
function	get_mat_best_price_equi(best_equi, mat_price)
{
	let i, j, path;
	var	best_price = [];

	for (j = 0; j < 4; j++)
	{
		best_price[j] = [];
		for (i = 0; i < 4; i++)
		{
			best_price[j][i] = 0;
			if (i == j)
				continue ;
			path = (best_equi[j][i] !== undefined) ? [j, best_equi[j][i], i] : [j, i];
//			console.log("best_equi[", j, "][", i, "]:", best_equi[j][i]);
			best_price[j][i] = eval_path(path, mat_price);
		}
	}
	return (best_price);
}

function	set_hard_cycle4()
{
	lst_cycle = [[0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 2, 1], [1, 3, 1], [2, 3, 2],
			[0, 1, 2, 0], [2, 1, 0, 2], [1, 2, 3, 1], [3, 2, 1, 3], [0, 2, 3, 0], [3, 2, 0, 3], [0, 3, 1, 0], [1, 3, 0, 1],
			[0, 1, 3, 2, 0], [0, 2, 3, 1, 0], [0, 1, 2, 3, 0], [0, 3, 2, 1, 0], [0, 2, 1, 3, 0], [0, 3, 1, 2, 0]];
}

function	get_hard_cycle4()
{
	var cycles = [[0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 2, 1], [1, 3, 1], [2, 3, 2],
			[0, 1, 2, 0], [2, 1, 0, 2], [1, 2, 3, 1], [3, 2, 1, 3], [0, 2, 3, 0], [3, 2, 0, 3], [0, 3, 1, 0], [1, 3, 0, 1],
			[0, 1, 3, 2, 0], [0, 2, 3, 1, 0], [0, 1, 2, 3, 0], [0, 3, 2, 1, 0], [0, 2, 1, 3, 0], [0, 3, 1, 2, 0]];
	return (cycles);
}

//	il faut donner le path reel des monaie pas celui aproximer
//	     ... un peu plus chian de choper le max
function	def_qty_avaliable(path, mat_price, mat_vol)
{
	let	volume_min, vol_prev, vol_eq, tmp, coef_correct, id1, id2, i, len, id_min;

//	console.log("											====> path:", path);

	id1 = path[0];
	id2 = path[1];
	volume_min = mat_vol[id1][id2];
//	console.log("vol_min[0]:", volume_min);
	vol_prev = volume_min;
	len = path.length - 1;
	coef_correct = 1;
	id_min = id1;
	for (i = 1; i < len; i++)
	{
//		console.log("vol_min[", i, "]:", volume_min);
		id1 = path[i];
		id2 = path[i + 1];
//		console.log("id1:", id1, "	id2:", id2, "	vol_prev:", vol_prev);
		if(vol_prev == undefined)
		{
			return (0);
		}
		vol_eq = mat_price[id1][id2] * vol_prev;
		tmp = vol_eq / mat_vol[id1][id2];
		if (tmp < 1)
		{
			coef_correct *= tmp;
			vol_eq *= tmp;
			volume_min *= tmp;
			id_min = id1;
		}
		vol_prev = vol_eq;
	}
//	console.log("qtyMin(", id_to_name[path[0]], "):", volume_min, "		{id, coef}_min:", "{", id_min, ", ", coef_correct, "}");
	return (volume_min);
	// on prend le volume du premier echange
	// on le compare au volume dans la monnaie suivante et si il y a une reduction de volume on quantifie comben
	// on fait toute les chaine
	// on reporte le coef de correction --> on a un equivalent du volume 
}

function	print_result_cycle(path, mat_price, mat_inter, mat_vol, mat_price2)
{
	// le nom des monnaie, le nom de intermediaire, 
	//	BTH  => (RPX) =>  ETH 
	let names, lst_id, i, len, id, sum, id_1, id_2, benef, vol_min;

	// on construit la liste des index des monnai par lesquell on passe reelement
	// on fait aussi la somme du parcourt
//	console.log("											====> path:", path);
	names = "";
	lst_id = [];
	len = path.length - 1;
	id = 0;
	sum = 1;
	for (i = 0; i < len; i++)
	{
		id_1 = path[i];
		id_2 = path[i + 1];
		lst_id[id++] = id_1;
		lst_id[id++] = parseInt(mat_inter[id_1][id_2]);
		sum *= mat_price[id_1][id_2]; // la on calcule le truc avec le prix qui q deja ete concatener normalement
//		console.log("mat[", id_1, "][", id_2,"]:", mat_price[id_1][id_2], "		lst_id[", id, "]:", lst_id[id]);
	}
	lst_id[id] = parseInt(path[i]); // le dernier element(c'est aussi senssr etre le dernier id_2) ... ou pas

	// on construit une chaine de charactere avec tout leur nom
	for (i in lst_id)
	{
		names += ("(" + id_to_name[lst_id[i]] + ")  =>") ;
	}
	volume_min = def_qty_avaliable(lst_id, mat_price2, mat_vol);
	benef = volume_min * (sum - 1.0);
	console.log(names, sum, "	volume:", volume_min, "	 ==> benefice:", benef, id_to_name[lst_id[0]]);
}

function	compare_cycle(mat_price, cycles)
{
	let best_val, best_id, tmp_val, i;
	
	best_val = 0;
	best_id = undefined;
	for (i in cycles)
	{
		tmp_val = eval_path(cycles[i], mat_price);
		if (tmp_val > best_val)
		{
			best_val = tmp_val;
			best_id = i;
		}
	}
	return (best_id);
}

function	print_mat_connexion_bid_ask()
{
/////////// Les matrice qui prenne de la place //////////////////////
	for (j in mat_connexion)                                         //
	{                                                                //
		str = "";                                                    //
		for (i in mat_connexion[j])                                  //
			str += ("" + mat_connexion[j][i] + "").padStart(3);      //
		console.log("      ", str);                                  //
	}                                                                //
	console.log("\n\n\n\n");                                         //
	for (j in mat_bid_ask)                                           //
	{                                                                //
		str = "";                                                    //
		for (i in mat_bid_ask[j])                                    //
			str += (" |" + mat_bid_ask[j][i] + "|").padStart(3);     //
		console.log("      ", str);                                  //
	}                                                                //
	for (j in mat_volume)                                            //
	{                                                                //
		str = "";                                                    //
		for (i in mat_volume[j])                                    //
			str += (" |" + mat_volume[j][i] + "|").padStart(3);     //
		console.log("      ", str);                                  //
	}
/////////////////////////////////////////////////////////////////////
}


function	print_statment()
{
	let id1, id2, str = "", i, j;

	//////		On imprime la liste de tout les nom
	console.log("lst of name:");
	for (i in id_to_name)
	{
		console.log("    ", id_to_name[i]);
	}

	/////		On imprime la liste des connexion en associant les id aux nom
	console.log("lst of connexion:");
	for (i in lst_link_id)
	{
		id1 = lst_link_id[i].from;
		id2 = lst_link_id[i].to;
		console.log("    [", id1, "][", id2, "]:--> {", id_to_name[id1],":",  id_to_name[id2],"}");
	}

///////////// Les matrice qui prenne de la place //////////////////////
//	for (j in mat_connexion)                                         //
//	{                                                                //
//		str = "";                                                    //
//		for (i in mat_connexion[j])                                  //
//			str += ("" + mat_connexion[j][i] + "").padStart(3);      //
//		console.log("      ", str);                                  //
//	}                                                                //
//	console.log("\n\n\n\n");                                         //
//	for (j in mat_bid_ask)                                           //
//	{                                                                //
//		str = "";                                                    //
//		for (i in mat_bid_ask[j])                                    //
//			str += (" |" + mat_bid_ask[j][i] + "|").padStart(3);     //
//		console.log("      ", str);                                  //
//	}                                                                //
///////////////////////////////////////////////////////////////////////

	/////		On imprime une matrice de conexino
}

function	do_all_the_taf(bid_ask)
{
	var name = {};
	
	init_name();
	forge_the_names_and_links(bid_ask);
	make_bid_ask_matrix_lstlink_volume(bid_ask);
	print_statment();
//		console.log(bid_ask[id].symbol);
}



function	strategie_cycle(ticker)
{
	var	best_equi, mat_best_price, cycles, best_cycle, ratio;

	init_name();
	forge_the_names_and_links(ticker);									// 	id_to_name, name_to_id, lst_link_id, lst_link_name
	make_bid_ask_matrix_lstlink_volume(ticker, lst_link_id); 					//	mat_connexion, mat_bid_ask
//	print_mat_connexion_bid_ask();
	make_equivalent_path(mat_connexion);								//	lst_equivalent
//	console.log(lst_equivalent[1][2]);
	best_equi = find_best_equivqlent(lst_equivalent, mat_bid_ask);		//	RETURN: best_equivalent
//	console.log(best_equi);
	mat_best_price = get_mat_best_price_equi(best_equi, mat_bid_ask);	// RETURN:  price of best equivalent
	cycles = get_hard_cycle4();
	best_cycle = compare_cycle(mat_best_price, cycles);
//	console.log("best cycle:", best_cycle, "	the cycle-->", cycles[best_cycle]);
//	console.log(mat_best_price);
//	console.log(best_equi)
	print_result_cycle(cycles[best_cycle], mat_best_price, best_equi, mat_volume, mat_bid_ask);
}


binance.bookTickers((error, ticker) => {
	strategie_cycle(ticker);
//	console.log(ticker);
//	  console.log("bookTickers()", ticker);
//	do_all_the_taf(ticker);
});

/*
{ symbol: 'QTUMUSDT',
  bidPrice: '18.99900000',
  bidQty: '12.09100000',
  askPrice: '19.01900000',
  askQty: '24.00600000' }

*/
