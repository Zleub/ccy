const https = require('https')

let options = {
	"method": 'POST',
	"host": 'api.binance.com',
	"path": '/api/v3/account',

	headers: {
		"X-MBX-APIKEY": "80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw"
	}
}

let {default: Binance} = require('binance-api-node')

// const client = Binance()

// Authenticated client, can make signed calls
const client = Binance({
  apiKey: '80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw',
  apiSecret: 'yDHV58Y68rsxhrs5y7USdwV1YWovxj5V0pVjCh2fKgZ6PEHJ82oiEbxW2CvrZRNB',
})

// console.log(client)

// client.time().then(t => console.log(`start: ${new Date(t)}`))
// client.accountInfo().then( console.log )
// client.exchangeInfo().then( e => {
// 	e.symbols.forEach(_ => {
// 		if (_.baseAsset == 'ETH' && _.quoteAsset == 'BTC') {
// 			console.log(_)
// 			// console.log(`${_.baseAsset} -> ${_.quoteAsset}`)
// 			// console.log(_.filters)
// 		}
// 	})
// })

let corrs = {
	'LTCBNB' : 'BNBLTC', //: 'LTCBNB',
	'LTCUSDT': 'USDTLTC',
	'BNBUSDT': 'USDTBNB',
	// 'BNBUSDT': 'USDTBNB',
}

let splits = {
	'BNBLTC': ['BNB','LTC'],
	'LTCUSDT': ['LTC','USDT'],
	'BNBUSDT': ['BNB','USDT'],
	'LTCBNB': ['LTC','BNB'],
	'USDTLTC': ['USDT','LTC'],
	'USDTBNB': ['USDT','BNB'],
	// 'BNBUSDT': ['BNB','USDT']
}

let comple = {
	'BNBLTC': 'USDT',
	'LTCUSDT': 'BNB',
	'BNBUSDT': 'LTC',
	'LTCBNB': 'USDT',
	'USDTLTC': 'BNB',
	'USDTBNB': 'LTC',
	// 'BNBUSDT': ''
}

let f = array => {
	console.log( new Date().toTimeString() )
	let fs = {}


	// client.book({ symbol: 'ETHBTC' }).then( book => {
	// 	// console.log('book', book)
    //
	// 	client.ws.trades(array, e => {
	// 		let date = new Date(e.eventTime)
	// 		// if (e.maker)
	// 		console.log(date, 'trades')//, e.price, e.quantity, e.maker)
	// 	})
    //
	// 	client.ws.depth(array, e => {
	// 		let date = new Date(e.eventTime)
	// 		console.log(date, 'depth')//, e)
	// 	})
    //
	// 	setTimeout( () => {
	// 		client.ws.depth(array, e => {
	// 			let date = new Date(e.eventTime)
	// 			console.log(date, 'depth')//, e)
	// 		})
	// 	}, 200 )

		// client.ws.partialDepth({ symbol: 'ETHBTC', level: 10 }, e => {
		// 	let date = new Date(e.eventTime)
		// 	console.log(new Date(), 'partialDepth')//, e)
		// })
        //
		// client.ws.ticker(array, e => {
		// 	let date = new Date(e.eventTime)
		// 	console.log(date, 'ticker')//, e.bestBid, e.bestAsk)
		// })
	// } )


	// array.forEach(a => {
		let count = 0
		let close = client.ws.ticker(array, e => {
			let date = new Date(e.eventTime)
			// console.log(e)
			// console.log(date.toTimeString(), e)
			// console.log(`[${e.date}] ${e.symbol} : ${e.priceChange} {${e.curDayClose}}`)
			// console.log( JSON.stringify(e, false, "  ") )
			// client.prices().then(e => console.log( JSON.stringify(e['NANOETH'], false, "  ")))
			// console.log('----------------------------------------------------------')
			// caca()
			// if (e.maker)
			fs[ e.symbol ] = x => x * e.bestBid
			fs[ corrs[e.symbol] ] = x => x * (1 / e.bestAsk)

			Object.keys(fs).forEach(k => {
				if (fs[splits[k][1] + comple[k]] && fs[comple[k] + splits[k][0]]) {

					// if (fs[comple[k] + splits[k][0]](fs[splits[k][1] + comple[k]](fs[k](1))) > 1) {
						let [x, y, z] = [
							Number(fs[k](1).toFixed(8)),
							Number((fs[splits[k][1] + comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))),
							Number((fs[comple[k] + splits[k][0]]( Number((fs[splits[k][1] + comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))) ).toFixed(8)))
						]

						console.log(`${date.toTimeString()} 1 ${splits[k][0]} -> ${x}
	${splits[k][1]} -> ${y}
	${comple[k]} -> ${z} ${splits[k][0]}`)
					// }
				}
			})
    //
	// 		count += 1
			// if (count > 20) {
				// close()
				// console.log( fs )
			// }
		})
	// })

}

f(Object.keys(corrs))
// client.ws.trades(array, e => {

// f('ETH')('BTC')

let currs = [
	'ETH',
	'BTC',
	// 'ADA',
	// 'BNB',
	'USDT',
	// 'LTC',
	// 'NEO',
	// 'BCC'
]

// let caca = () => client.exchangeInfo().then( e => {
// 	let count = 0
// 	let {symbols} = e
//
// 	let tmp = []
// 	symbols.forEach(e => {
// 		let {symbol, baseAsset: base, quoteAsset: quote} = e
// 		if (currs.find( _ => _ == e.baseAsset ) && currs.find( _ => _ == e.quoteAsset )) {
// 			client.prices().then(e => {
// 				e = Object.keys(e).reduce( ((p,k) => {p[k] = Number(e[k]) ; return p}), {} )
// 				currs.forEach( c => {
// 					if (c != base && c != quote) {
// 						console.log(`base: ${base} | quote: ${quote} | c : ${c}`)
// 						let a = {
// 							[base + quote] : e[base + quote],
// 							[quote + base] : Number((1 / e[base + quote]).toFixed(8)),
// 							[c + quote] : e[c + quote] || Number((1 / e[quote + c]).toFixed(8)),
// 							[c + base] : e[c + base] || Number((1 / e[base + c]).toFixed(8)),
// 							[quote + c] : e[quote + c] || Number((1 / e[c + quote]).toFixed(8)),
// 							[base + c] : e[base + c] || Number((1 / e[c + quote]).toFixed(8)),
// 						}
//
// 						console.log(a)
// 					}
// 				})
//
// 			})
//
// 		}
// 	})
// })

// let g = a => b => client.prices().then( e => {
// 	console.log(e)
// 	// if (e[a + b])
// 	// 	console.log(`${a} -> ${b}: ${e[a + b]}`)
// 	// console.log(`${b} -> ${a}: ${e[b + a]}`)
// 	// f(a)(b)
// 	// f(b)(a)
// })
//
// let currencies = [ 'BTC', 'ETH', 'USDT', 'BNB', 'ADA' ]
//
// currencies.forEach( (e,i) => {
// 	currencies.forEach( (_e, _i) => {
// 		if (i != _i)
// 			g(e)(_e)
// 	})
// })

// g('ETH')('BTC')
// g('ETH')('BNB')
//
// g('BTC')('ETH')
// g('BTC')('USDT')
//
// g('USDT')('ETH')
// g('USDT')('BTC')
// global.sum = []
//
// let sum = x => y => x + y
// for (var i = 0; i < 9; i++) {
// 	global['sum'].push(sum(i))
// }
//
// console.log(global.sum)
// console.log(global.sum[1](3))
// console.log(global.sum[4](4))
