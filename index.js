const https = require('https')
const child_process = require('child_process')

let options = {
	"method": 'POST',
	"host": 'api.binance.com',
	"path": '/api/v3/account',

	headers: {
		"X-MBX-APIKEY": "80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw"
	}
}

let {default: Binance} = require('binance-api-node')

const client = Binance()

if (process.argv.slice(2, 5).length != 3) {
	process.exit()
}

let monals = process.argv.slice(2, 5)

let corrs = {}
corrs[monals[0] + monals[1]] = monals[1] + monals[0]
corrs[monals[0] + monals[2]] = monals[2] + monals[0]
corrs[monals[1] + monals[2]] = monals[2] + monals[1]

let splits = {}
let comple = {}
for (var i = 0; i < monals.length; i++) {
	for (var j = 0; j < monals.length; j++) {
		for (var k = 0; k < monals.length; k++) {
			if (monals[i] != monals[j])
				splits[monals[i] + monals[j]] = [monals[i], monals[j]]
				if (monals[i] != monals[k] && monals[j] != monals[k])
					comple[monals[i] + monals[j]] = monals[k]
			}
	}
}


// Authenticated client, can make signed calls
// const client = Binance({
  // apiKey: '80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw',
  // apiSecret: 'yDHV58Y68rsxhrs5y7USdwV1YWovxj5V0pVjCh2fKgZ6PEHJ82oiEbxW2CvrZRNB',
// })
client.exchangeInfo().then( exchange => {

	corrs = Object.keys(corrs).reduce((p,k) => {
		if (!exchange.symbols.some(e => e.symbol == k))
			p[ corrs[k] ] = k
		if (!exchange.symbols.some(e => e.symbol == corrs[k]))
			process.exit(-1)
		return p
	}, {})

	console.log([corrs, splits, comple])


	let f = array => {
		console.log( new Date().toTimeString() )


		let fs = {}
		let count = 0
		let close = client.ws.ticker(array, e => {
			let date = new Date(e.eventTime)
			fs[ e.symbol ] = x => x * e.bestBid
			fs[ corrs[e.symbol] ] = x => x * (1 / e.bestAsk)

			Object.keys(fs).forEach(k => {
				if (fs[splits[k][1] + comple[k]] && fs[comple[k] + splits[k][0]]) {
					if (fs[comple[k] + splits[k][0]](fs[splits[k][1] + comple[k]](fs[k](1))) > 1.005 ) {
						let [x, y, z] = [
							Number(fs[k](1).toFixed(8)),
							Number((fs[splits[k][1] + comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))),
							Number((fs[comple[k] + splits[k][0]]( Number((fs[splits[k][1] + comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))) ).toFixed(8)))
						]
						let str = `${date.toTimeString()} 1 ${splits[k][0]} -> ${x} ${splits[k][1]} -> ${y} ${comple[k]} -> ${z} ${splits[k][0]}`
						str += Object.keys(e).reduce((p,k) => p + `${k}: ${e[k]}\n`, " ```") + '```'
						// child_process.exec(`curl -X POST -H 'Content-type: application/json' --data '{"text": "${str}"}' https://hooks.slack.com/services/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`, (err, stdout, stderr) => {
						console.log(str)
						// })

					}
				}
			})
		})

	}

	f(Object.keys(corrs))


})
