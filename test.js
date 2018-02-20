const log = console.log
const {default: Binance} = require('binance-api-node')
const client = Binance({
  apiKey: '80CAh6CWHNmfDCNgAZ6BGaUAolHUicWCKnhpLCLHu21gsoextvoymLP09Z2ytScw',
  apiSecret: 'yDHV58Y68rsxhrs5y7USdwV1YWovxj5V0pVjCh2fKgZ6PEHJ82oiEbxW2CvrZRNB',
})

client.accountInfo().then(e => log(e.balances.find(_ => _.asset == 'BCC')))
client.prices().then(e => {
  let hold = 1.001
  let ref = Number(e['BCCBTC'])
  let hold_ref = (ref + 0.000005) * hold

  log(ref)
  log( client.orderTest({
    symbol: 'BCCBTC',
    side: 'BUY',
    quantity: 20,
    price: ref + 0.000005,
  }).then(e => {
    let state = 'selling'

    log(`[${new Date()}] buyin ${20} BCC for ${(ref + 0.000005) * 20} BTC (${ref + 0.000005})`)
    log(`hold: ${hold} | ${hold_ref * 20} BTC (${hold_ref})`)

    let close = client.ws.partialDepth({ symbol: 'BCCBTC', level: 10 }, e => {
    	let date = new Date(e.eventTime)
    	// console.log(new Date(), 'partialDepth', e)
      if (Number(e.asks[0].price) >= hold_ref) {
        console.log(`[${new Date()}] selling 20 BCC for ${hold_ref} BTC`)
        close()
      }
    })
  }))
})
