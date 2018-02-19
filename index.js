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

let f = array => {
	let count = 0
	let close = client.ws.ticker(array, e => {
		let date = new Date(e.eventTime).toDateString()
		// console.log(`[${e.date}] ${e.symbol} : ${e.priceChange} {${e.curDayClose}}`)
		console.log( JSON.stringify(e, false, "  ") )
		client.prices().then(e => console.log( JSON.stringify(e['NANOETH'], false, "  ")))

		count += 1
		if (count == 20)
			close()
	})
}

// f(['ETHBTC'])

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

client.exchangeInfo().then( e => {
	let count = 0
	let {symbols} = e

	// let _f = () => client.prices().then( _ => {
	// 	symbols.forEach( s => {
	// 		if (currs.some( _ => _ == s.symbol)) {
	// 			let {baseAsset, quoteAsset} = s
	// 			console.log(`${baseAsset} ${quoteAsset} ${corrs[baseAsset + quoteAsset]}`)
    //
	// 			let a = symbols.find(_ => _.symbol == (corrs[baseAsset + quoteAsset] + quoteAsset) )
	// 			let b = symbols.find(_ => _.symbol == (corrs[baseAsset + quoteAsset] + baseAsset) )
    //
	// 			if (a)
	// 				console.log(`${a.symbol}`)
	// 			if (b)
	// 				console.log(`${b.symbol}`)
    //
	// 			// console.log(`1 ${s.baseAsset} <-> ${_[s.symbol]} ${s.quoteAsset}`)
	// 			// console.log(`1 ${s.quoteAsset} <-> ${(1 / _[s.symbol]).toFixed(8)} ${s.baseAsset}`)
	// 		}
	// 	})
	// 	console.log('')
	// 	count += 1
    //
	// 	if (count < 4)
	// 		_f()
	// })
    //
	// _f()

	let tmp = []
	symbols.forEach(e => {
		let {symbol, baseAsset: base, quoteAsset: quote} = e
		if (currs.find( _ => _ == e.baseAsset ) && currs.find( _ => _ == e.quoteAsset )) {
			client.prices().then(e => {
				e = Object.keys(e).reduce( ((p,k) => {p[k] = Number(e[k]) ; return p}), {} )
				currs.forEach( c => {
					if (c != base && c != quote) {
						console.log(`base: ${base} | quote: ${quote} | c : ${c}`)
						let a = {
							[base + quote] : e[base + quote],
							[quote + base] : Number((1 / e[base + quote]).toFixed(8)),
							[c + quote] : e[c + quote] || Number((1 / e[quote + c]).toFixed(8)),
							[c + base] : e[c + base] || Number((1 / e[base + c]).toFixed(8)),
							[quote + c] : e[quote + c] || Number((1 / e[c + quote]).toFixed(8)),
							[base + c] : e[base + c] || Number((1 / e[c + quote]).toFixed(8)),
						}

						console.log(a)

						// console.log(`1 ${c} => ${a[c + quote]} ${quote} => ${a[quote + base]} ${base}`)
					}
				})

			})

		}
	})
})

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
