const http = require('http')
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

let init = (monals) => {
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

	return { corrs, splits, comple }
}

let monals = process.argv.slice(2, 5)
let { corrs, splits, comple } = init(monals)
let vars = {
	type: 'watchers',
	monals, corrs, splits, comple
}

let post = (exchange) => {
	// console.log('post')
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
		let data = ""

		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			data += chunk
		});
		res.on('end', () => {
			if (res.statusCode == 202) {
				r = JSON.parse(data)
				let { corrs: _corrs, splits: _splits, comple: _comple } = init(r.monals)
				vars = {
					type: r.type,
					monals: r.monals,
					corrs: _corrs,
					splits: _splits,
					comple: _comple,
					assigned: r.assigned,
					id: r.id
				}
				vars.corrs = Object.keys(vars.corrs).reduce((p,k) => {
					if (exchange.symbols.some(e => e.symbol == k))
						p[ vars.corrs[k] ] = k
					else if (!exchange.symbols.some(e => e.symbol == vars.corrs[k])) {
						console.log(`no such symbol ${k} ${vars.corrs[k]}`)
						console.log(vars.corrs)
						process.exit(-1)
					}

					p[k] = vars.corrs[k]
					return p
				}, {})
			}
			console.log('No more data in response.');
		});
	})

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});

	req.write(JSON.stringify({
		type: 'watchers', monals: vars.monals
	}))
	req.end()

	process.on('SIGINT', (code) => {
		let req = require(`http`).request({
			protocol: 'http:',
			host: 'monitor.adebray.ovh',
			method: 'POST',
			path: '/unregister',
			auth: 'nginx:asdzefasxzdc123',
			headers: {
				'Content-Type': 'application/json',
			}
		}, (res) => {
			process.exit(-1)
		})

		req.write(JSON.stringify({
			type: vars.type,
			monals: vars.monals,
			id: vars.id
		}))
		req.end()
	})

}

// Authenticated client, can make signed calls
// const client = Binance({
  // apiKey: '80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw',
  // apiSecret: 'yDHV58Y68rsxhrs5y7USdwV1YWovxj5V0pVjCh2fKgZ6PEHJ82oiEbxW2CvrZRNB',
// })

client.exchangeInfo().then( exchange => {

	vars.corrs = Object.keys(vars.corrs).reduce((p,k) => {
		console.log(k, vars.corrs[k])
		if (exchange.symbols.some(e => e.symbol == k))
			p[ vars.corrs[k] ] = k
		else if (!exchange.symbols.some(e => e.symbol == vars.corrs[k])) {
			console.log(`no such symbol ${k} ${vars.corrs[k]}`)
			console.log(vars.corrs)
			process.exit(-1)
		}

		p[k] = vars.corrs[k]
		return p
	}, {})

	// console.log([vars.corrs, vars.splits, vars.comple])
	post(exchange)

	let f = array => {
		console.log( new Date().toTimeString() )

		let fs = {}
		let count = 0
		let close = client.ws.ticker(array, e => {
			let date = new Date(e.eventTime)
			fs[ e.symbol ] = x => x * e.bestBid
			fs[ vars.corrs[e.symbol] ] = x => x * (1 / e.bestAsk)

			[e.symbol, vars.corrs[e.symbol] ].forEach(k => {
				if (fs[vars.splits[k][1] + vars.comple[k]] && fs[vars.comple[k] + vars.splits[k][0]]) {
					if (fs[vars.comple[k] + vars.splits[k][0]](fs[vars.splits[k][1] + vars.comple[k]](fs[k](1))) > 1.005 ) {
						let [x, y, z] = [
							Number(fs[k](1).toFixed(8)),
							Number((fs[vars.splits[k][1] + vars.comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))),
							Number((fs[vars.comple[k] + vars.splits[k][0]]( Number((fs[vars.splits[k][1] + vars.comple[k]]( Number(fs[k](1).toFixed(8)) ).toFixed(8))) ).toFixed(8)))
						]
						let str = `${date.toTimeString()} 1 ${vars.splits[k][0]} -> ${x} ${vars.splits[k][1]} -> ${y} ${vars.comple[k]} -> ${z} ${vars.splits[k][0]}`
						str += Object.keys(e).reduce((p,k) => p + `${k}: ${e[k]}\n`, " ```") + '```'

						// child_process.exec(`curl -X POST -H 'Content-type: application/json' --data '{"text": "${str}"}' https://hooks.slack.com/services/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`, (err, stdout, stderr) => {
							console.log(str)
						// })
						let req = require(`http`).request({
							protocol: 'http:',
							host: 'monitor.adebray.ovh',
							method: 'POST',
							path: '/log',
							auth: 'nginx:asdzefasxzdc123',
							headers: {
								'Content-Type': 'text/plain',
							}
						}, (res) => {
							// process.exit(-1)
						})

						req.write(str)
						req.end()

					}
				}
			})
		})

	}

	f(Object.keys(vars.corrs))
})
