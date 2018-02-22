const log = console.log
const {default: Binance} = require('binance-api-node')
const client = Binance({
  apiKey: '80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw',
  apiSecret: 'yDHV58Y68rsxhrs5y7USdwV1YWovxj5V0pVjCh2fKgZ6PEHJ82oiEbxW2CvrZRNB',
})

let opt = {}

process.stdin.on('readable', () => {
	const chunk = process.stdin.read();
	if (chunk !== null) {
		_ = chunk.toString().trim()
		if (_ == 'tmp_verbose' || _ == 'tv')
			opt['tmp_verbose'] = !(opt['tmp_verbose'])
		if (_ == 'verbose' || _ == 'v')
			opt['verbose'] = !(opt['verbose'])
		if (_ == 'debug' || _ == 'd')
			opt['debug'] = !(opt['debug'])
		if (_ == 'post' || _ == 'p')
			opt['post'] = !(opt['post'])
	}
});

let loop = ({account, symbol, price}) => {
	let id = -1
	let balance = JSON.stringify( account.balances.find(_ => _.asset == 'BNB') )
	let hold = 1.005
	let ref = 0.000905

	let gold = 1

	let init = Number((ref + (1 / (10 ** Number(symbol.baseAssetPrecision)))).toFixed(7))
	let top = Number(( (init) * hold).toFixed(7) )
	let bottom = Number(( (init) * (2 - hold)).toFixed(7) )

	let state = 'buyin'
	let memory = {}

	let type = 'gamblers'

	let dump_toString = () => {
		s = `[[${id}]] {{${type}}}` + '\n'
		s += `${symbol.symbol}` + '\n'
		s += `hold: ${hold} | ref: ${ref}` + '\n'
		s += `gold: ${gold} | state: ${state}` + '\n'
		s += `init: ${init} | top: ${top} | bottom: ${bottom}` + '\n'
		s += `balance: ${balance} |` + '\n'
		s += JSON.stringify(memory)
		return s
	}
	let dump = () => {
		log(dump_toString())
	}
	let post = () => {
		let req = require(`http`).request({
			protocol: 'http:',
			host: 'monitor.adebray.ovh',
			method: 'POST',
			path: '/register',
			auth: 'nginx:asdzefasxzdc123',
			headers: {
				'Content-Type': 'application/json',
			}
		}, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			// console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				// console.log(`BODY: ${chunk}`);
				id = Number(chunk)
			});
			// res.on('end', () => {
			// 	console.log('No more data in response.');
			// });
		})

		req.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
		});
		req.write(JSON.stringify({
			id, type, symbol, hold, ref, gold, state, init, top, bottom, balance, memory
		}))
		req.end()

	}
	// log( client.orderTest({
	// 	symbol: 'BNBBTC',
	// 	side: 'BUY',
	// 	quantity: 20,
	// 	price: init,
	// }).then(e => {

		// gold -= (init) * 20
		// log(`[${new Date()}] buyin 20 BNB for ${init} BTC {${gold}}`)
		// state = 'buyin'
		// memory[init] = 20

		dump()
		post()

		let close = client.ws.partialDepth({ symbol: 'BNBBTC', level: 10 }, e => {
			let date = new Date(e.eventTime)

			if (opt['tmp_verbose']) {
				log(`[${new Date()}] | bids ${e.bids[0].price} | ask ${e.asks[0].price}`)
				opt['tmp_verbose'] = !(opt['tmp_verbose'])
			}
			if (opt['verbose']) {
				log(`[${new Date()}] | bids ${e.bids[0].price} | ask ${e.asks[0].price}`)
			}
			if (opt['debug']) {
				dump()
				opt['debug'] = !(opt['debug'])
			}
			if (opt['post']) {
				post()
				opt['post'] = !(opt['post'])
			}


			if (state == 'sellin' && Number(e.asks[0].price) >= top) {
				gold += Number(e.asks[0].price) * 20
				log(`[${new Date()}] sellin 20 BNB for ${e.asks[0].price} BTC {${gold}}`)
				state = 'buyin'
			}

			else if (state == 'buyin' && Number(e.bids[0].price) <= bottom) {
				gold -= Number(e.bids[0].price) * 20
				log(`[${new Date()}] buyin 20 BNB for ${e.bids[0].price} BTC {${gold}}`)
				state = 'sellin'
			}
		})
	// }))

}

client.accountInfo().then(a => {
	log(a.balances.find(_ => _.asset == 'BNB'))
	client.exchangeInfo().then(e => {
		let symbol = e.symbols.find(_ => _.symbol == 'BNBBTC')

		log(symbol)
		client.prices().then(e => {
			loop({
				account: a,
				symbol,
				price: e['BNBBTC']
			})
		})
	})

})
