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

function	get_symbole_transaction(couple, symbols)
{
	end = couple.slice(-3);
//	console.log("couple", couple);
	// un truc hyperspecifique a ce cas specifique
	//
}

//	le symbole de fin est toujours l'un des 4 BTC, ETH, BNB, USDT
function get_graph(couple)
{
	var meta_price = []; // le truc qui resumera le bid et le ask des meta cercle
	var	mata_conect = []; // 3 dimeniton : cpnection [id1][id2][lst_connexion]
	var	links = [[], [], [], []]; // on a aumoins les 4 case des monnaie reference
	var	graph = {};
	var	mat = [[], [], [], []];

	var	symbols = [ "USDT", "BTC", "ETH", "BNB"];
	var	symb_id = 4;
	var symbols_rev = [];
	symbols_rev["USDT"] = 0;
	symbols_rev["BTC"] = 1;
	symbols_rev["ETH"] = 2;
	symbols_rev["BNB"] = 3;

	var connexion = [];

	let ok = get_symbole_transaction("TOKYOBTC", symbols_rev);
	console.log("============>", ok);

	var beg, end1, end2, end, id1, id2;	// les smbole dans le couple d'echange
	let l1, l2;
	for (j in couple)
	{
		for (i in couple[j]) // les couple de taille 6, donc connue
		{
			end2 = couple[j][i].slice(-4);
			end1 = end2.slice(-3);
			if (symbols_rev[end1] !== undefined)
			{
				beg = couple[j][i].slice(0, -3);
				end = end1;
			}
			else if (symbols_rev[end2] !== undefined)
			{
				beg = couple[j][i].slice(0, -4);
				end = end2;
			}
			else	// pour filtrer le couple "123456"
				continue ;
			if (symbols_rev[beg] == undefined)	// on ajoute le symbole si il est nouveau
			{
				symbols[symb_id] = beg;
				symbols_rev[beg] = symb_id++;
			}
			id1 = symbols_rev[end];
			id2 = symbols_rev[beg];
			if (id1 === undefined || id2 === undefined || end === undefined || beg === undefined)
				console.error("																				!!! Halte la mon amis !!!		id1:", id1, " id2:", id2, " beg:", beg, " end:", end);
			connexion.push([id1, id2]);
			if(links[id2] === undefined)
				links[id2] = [];
			l1 = links[id1].length;
			l2 = links[id2].length;
			links[id1][l1] = id2;
			links[id2][l2] = id1;
			if (mat[id2] === undefined)
				mat[id2] = [];
			mat[id1][id2] = 1;
			mat[id2][id1] = 1;
//			console.log("beg:", beg, "	len:", beg.length, "			end:", end, "	len:", end.length);
		}
	}
	//// on netoie la matrice de connexion
	let len = symbols.length;
	for (j = 0; j < len; j++)
	{
		if (mat[j] == undefined)
			mat[j] = [];
		for (i = 0; i < len; i++)
		{
			if (mat[j][i] === undefined || mat[j][i] === NaN)
				mat[j][i] = 0;
		}
	}
	////////////////////////////////////////////////////////////////////////
	////////////////// vvv matrice de meta connexion vvv ///////////////////
//	let len1 = mat[0].length; // le nombre de monnaie qu'on ai 
	meta_conect = [];
	for (j in mat)
	{
		meta_conect[j] = [];
		for (i in mat[j])
		{
			let cnt = 0;
			meta_conect[j][i] = [];
			for(k = 0; k < 4; k++)
			{
				if (mat[j][k] != 0 && mat[k][i] != 0) // on teste les monnaie central
				{
					meta_conect[j][i][cnt] = k;
					cnt++;
				}
			}
		}
	}
	////////////////////////////////////////////////////////////////////////
	////////////////// vvv  matrice de meta bid/ask  vvv ///////////////////
	//	--: la il faut juste connaitre les bid et les ask et puis les cumuler dans le bon sens
	let id_in, id_out;// in => prioritaire out pas prio :: c'est definie dans le nom de l'echange
	for (j = 0; j < len; j++)
	{
		meta_price[j] = [];
		for (i = j + 1; i < len; i++ )
		{
			let bid;
			let ask;
			bid = 1;
			ask = 3 * ask;
			meta_price[i] = [];
			meta_price[j][i] = bid; // qui est le maitre... [0, 1, 2, 3] OU ALORS le plus petit, donc le maitre est le plue petit
			meta_price[i][j] = ask;
		}
	}
	////////////////// vvv    matrice de bid/ask     vvv ///////////////////
	//	--: 
	////////////////////////////////////////////////////////////////////////
	graph.symb_name2id = symbols_rev;
	graph.symb_id2name = symbols;
	graph.id_conect = connexion;
	graph.links = links;
	graph.mat = mat;
	return (graph);
}

function	mat_mult(mat1, mat2)
{
	var result = [];
	var	len;
	let tmp;
	let tmp_str;

	len = mat1.length;
	for (j in mat1)
	{
		result[j] = [];
		for (i in mat1[j])
		{
			tmp = 0;
			for (k = 0; k < len; k++)
			{
//				let m1, m2;
//				m1 = ((mat1[j] !== undefined) ? "OK      ": "undefined");
//				m2 = ((mat2[k] !== undefined) ? "OK      ": "undefined");
//				console.log("i:", i, " j:", j, " k:", k, " len:", len, "mat1[j]:", m1, "mat2[k]", m2, "		c1:", mat1[j][k], " c2:", mat2[k][i]);
				tmp += mat1[j][k] * mat2[k][i];
			}
			result[j][i] = tmp;
//			console.log("===>", tmp)
		}
	}
	return (result);
}

//
//function	print_symbole(graph)
//{
//}
//
//function	print_links(graph)
//{
//}
//
//function	print_mat(graph)
//{
//
//}
//

function	graph_all_print(graph)
{
	//			INFO BRUTE
	// on va print tout ses parametre
	// une str de tout les {id, "name"} sans retour a la ligne
	let	str = "";
	let id_str;
	let sum, sum_all;

	for (i in graph.symb_id2name)
	{
	//	id_str = new String(i);
		str += "{" + i + ":"+ graph.symb_id2name[i] + "}\n";
	}
	console.log("ID <=> NAME\n", str);
	console.log("\n\n\nCONNEXION:");
	sum_all = 0;
	for (j in graph.links)
	{
		str = "[" + j + "]      ";
		sum = 0;
		for (i in graph.links[j])
		{
			str += ", " + graph.links[j][i] + "";
			sum += 1; 
		}
		sum_all += sum;
		console.log(("sum:" + sum + "").padEnd(8), "		", str, "");
	}
	console.log(str, "\n_sum_ total:", sum_all);
	console.log("\n\n\nALL MAT CONNEXTION");
	sum_all = 0;
	for (j in graph.mat)
	{
		str = "";
		sum = 0;
		for (i in graph.mat[j])
		{
	//		console.log("[", j, "][", i, "]=>", graph.mat[j][i]);
		//	console.log("[", i, "][", j, "]:->",  graph.mat[j][i]);
			tmp_str = ((graph.mat[j][i] == 0) ? ".": "" + graph.mat[j][i] + "");
			str += tmp_str.padStart(4);
			sum += graph.mat[j][i];
		}
		console.log("sum:", ("" + sum + "").padEnd(10), str, "");
		sum_all += sum;
	}

	console.log("sum total:", sum_all, "\n=====================================");
	// un tableau avec par ligne les id conecter avec l'id de la ligne 
	// on construit un tableau de chane de character avec toute les connexion
	// ----------
	//			INFO STATE
	// la on va faire des debut d'annalyse de conectiviter de distance de tout ca
	// avev peut etre des 
	// ---------
	// 		Peut on abstraire les quatre monnaie centrale et definir une multitude de connection entre de ultiple point
	// 	==> contruire une matrice symlpe qui symbolise la situation
	// 	==> une matrice (ou systeme de matrice) plus complex qui modelise mieux les interaction... ou alors on peu quand meme le faire en simplifier
	// 			==> a quoi ressembles les bid et les ask d'une connexion complex
}

//--> la on va cree l'association des baille

//Getting latest price of all symbols
binance.prices((error, ticker) => {
	 var graph = {};
	 var couple = [];			// 
	 var i = 0;
	 for (elem in ticker)
		couple[i++] = elem;
//	console.log("===>", couple);
	graph = get_graph(couple);
	graph_all_print(graph);

	var mat_org = graph.mat;
	graph.mat = mat_mult(graph.mat, graph.mat);
	graph_all_print(graph);
});

//binance.prices((error, ticker) => {
//	  console.log("prices()", ticker);
//});

//binance.bookTickers((error, ticker) => {
//	  console.log("bookTickers()", ticker);
//});
