const https = require('https')
const {spawn} = require('child_process')

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

let dict = {}
client.exchangeInfo().then( exchange => {
	exchange.symbols.forEach(e => {
		dict[e.quoteAsset] = true
	})
	exchange.symbols.forEach(e => {
		dict[e.baseAsset] = true
	})

	let __ = Object.keys(dict).slice(0, 8).filter(e => e != '123' && e != '456')
	console.log(__)

	__.forEach( i => {
	__.forEach( j => {
	__.forEach( k => {
		if (i != j && i != k && j != k) {
			const args = ['watcher.js', i, j, k]
			const child = spawn('node', args);

			child.stdout.on('data', (data) => {
			  console.log(`stdout: ${data}`);
			});

			child.stderr.on('data', (data) => {
			  console.log(`stderr: ${data}`);
			});

			child.on('close', (code) => {
			  console.log(`child process exited with code ${code}`);
			});

			child.on('exit', (code) => {
			  console.log(`child process exited with code ${code}`);
			});
			child.on('disconnect', (code) => {
			  console.log(`child process exited with code ${code}`);
			});
            
			child.on('error', (err) => {
			  console.log(`Failed to start subprocess ${args}`);
			});
		}
	})})})

	// while (42) ;
})
