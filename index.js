console.log("Hello World !")

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

let f = a => b => client.ws.ticker(a + b, ({
			eventType,
		    eventTime,
		    symbol,
		    priceChange,
		    priceChangePercent,
		    weightedAvg,
		    prevDayClose,
		    curDayClose,
		    closeTradeQuantity,
		    bestBid,
		    bestBidQnt,
		    bestAsk,
		    bestAskQnt,
		    open,
		    high,
		    low,
		    volume,
		    volumeQuote,
		    openTime,
		    closeTime,
		    firstTradeId,
		    lastTradeId,
		    totalTrades
		}) => {
		let date = new Date(eventTime).toDateString()
		console.log(`[${date}] ${a} -> ${b} : ${priceChange} {${curDayClose}}`)
	})

client.exchangeInfo().then( e => {
	let base_stack = []
	let quote_stack = []
	e.symbols.forEach( s => {
		if (!quote_stack.find( e => e == s.quoteAsset ))
			quote_stack.push(s.quoteAsset)
		if (!base_stack.find( e => e == s.baseAsset ))
			base_stack.push(s.baseAsset)
		// console.log('----------------------')
		// console.log(s.baseAsset, s.quoteAsset)
		// e.symbols.forEach( _ => {
		// 	if (s.baseAsset == _.quoteAsset && s.quoteAsset == _.baseAsset)
		// 		console.log(`reciprok: ${s.baseAsset} - ${s.quoteAsset}`)
			// console.log(_.quoteAsset, _.baseAsset)
		// })
	})
	console.log(quote_stack)

	e.symbols.forEach( s => {
		if (quote_stack.find(e => s.quoteAsset == e || s.baseAsset == e))
			console.log(`${s.baseAsset} -> ${s.quoteAsset}`)
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
