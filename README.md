# ccy

`npm install`

This is my branch for bots and such. It may contains in some futur
an sdk in plain ES6 javascript.

For now, it contains three scripts

- gambler, once connected to a binance stream, it pick a -5% and +5% of a value and will guarantee outcome

  `node spawner.js`

- watcher, read three binance `ticker` stream and look for trianglic situation where money could be generated

  `node spawner.js`

- spawner, take a binance `exchangeInfo` and generate tuple of
three crypto to instanciate a watcher one those.

  `node spawner.js`
