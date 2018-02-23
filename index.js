const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.text())

let load = (path, _) => fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : _
let save = (path, _) => fs.writeFileSync(path, JSON.stringify(_))
let data = load('./data.json', {})

let regular_save = () => {
	console.log('saved data.json')
	save('./data.json', data)
	setTimeout(regular_save, 60000)
}

// tmp ??
// data.watchers ? data.watchers.forEach(e => e.assigned ? e.assigned = false : null) : null

let schema = load('./schema.json')

var Ajv = require('ajv')
var ajv = new Ajv({allErrors: true}) // options can be passed, e.g. {allErrors: true}
var validate = ajv.compile(schema)
if (!validate(data))
	console.log(validate.errors)

let doc = ''
let log = (...args) => {
	args.forEach( e => doc += e + '\n')
	// console.log.apply(null, args)
}

app.get('/', function(req, res) {
	res.status(200).end(fs.existsSync('./client/index.html') ? fs.readFileSync('./client/index.html') : "")
})
log('GET / -> client/index.html\n')

app.get('/data', function(req, res) {
	res.send(JSON.stringify(Object.keys(data).reduce( (p,k) => {
		if (k != 'log')
			p[k] = data[k]
		return p
	}, {}), false, "  "))
})
log('GET /data -> ' + JSON.stringify(schema, false, "  ") + '\n')

app.post('/register', function(req, res, next){
	if (! data[req.body.type] )
		res.status(400).end()
	else {
		req.url = '/' + req.body.type
		return app._router.handle(req, res, next)
	}
})
log('[WIP] POST /register -> some bot\n')

app.post('/unregister', function(req, res, next){
	console.log('unregister')
	console.log(req.body)
	if (! data[req.body.type] )
		res.status(400).end()
	else {
		let tmp = data[req.body.type].find( e => {
			return Object.keys(req.body).find( (k) => {
																	// WOOT ?
				return (Object.keys(e).some(_ => _ == k)) && Object.keys(req.body).reduce( (p,_k) => {
					return p && JSON.stringify(e[_k]) == JSON.stringify(req.body[_k])
				}, true )
			})
		})
		tmp.assigned = false
		res.status(200).end()
		save('./data.json', data)
	}
})
log('[WIP] POST /unregister -> some bot\n')

let f = (schema) => {
	let _gen = (schema, root = '/', p, level = 0) => {
		if (schema.type == 'object') {
			if ((root).split('/').reverse()[0] != p)
				log(`${'  '.repeat(level)}${p} : {`)
			else
				log(`${'  '.repeat(level)}{`)
			Object.keys(schema.properties).forEach(k => {
				if ((root).split('/').reverse()[0] != p)
					_gen(schema.properties[k], root, k, level + 1)
				else
					_gen(schema.properties[k], root, k, level + 1)
			})
			if (p)
				log(`${'  '.repeat(level)}}`)
		}
		else if (schema.type == 'array') {
			if (schema.items) {
				if (schema.items.type == 'object' || schema.items.type == 'array') {
					if (!data[p])
						data[p] = []

					// CAREFULL
					app.get(root + p, function (req, res) {
						console.log(`${req.method} ${req.url}`)
						let r = data
						let __ = req.url.split('/').filter(_ => _ != '')
						while (__.length > 0) {
							r = r[__.splice(0, 1)]
							if (r == undefined) {
								res.status(400).end()
								break
							}
						}
						if (r.length < 100)
							res.status(200).end( JSON.stringify(r.slice(0, 99), false, "  ") )
						else
							res.status(200).end( JSON.stringify(r, false, "  ") )
					})

					let solve = (req, res, r) => {
						console.log(`${req.method} ${req.url}`)
						let __ = req.url.split('/').filter(_ => _ != '')
						while (__.length > 0) {
							r = r[__.splice(0, 1)]
							if (r == undefined) {
								res.status(400).end()
								break
							}
						}
						return r
					}

					app.get(root + p + '/length', function(req, res) {
						let r = solve(Object.assign(req, {url: root + p}), res, data)
						r ?
							res.status(200).end(r.length.toString()) :
							res.status(400).end()
					})
					log(`GET ${root + p}/length -> Number\n`)

					app.get(root + p + '/last', function(req, res) {
						let r = solve(Object.assign(req, {url: root + p}), res, data)

						r ?
							res.status(200).end(JSON.stringify(r.slice(r.length - 101, r.length - 1))) :
							res.status(400).end()
					})
					log(`GET ${root + p}/last -> 100 last ${p}\n`)

					app.get(root + p + '/last/:n', function(req, res) {
						let r = solve(Object.assign(req, {url: root + p}), res, data)

						r ?
							res.status(200).end(JSON.stringify(r.slice(r.length - Number(req.params.n) - 1, r.length - 1))) :
							res.status(400).end()
					})
					log(`GET ${root + p}/last/:n -> n last ${p}\n`)


					app.get(root + p + '/:n', function(req, res) {
						let r = solve(Object.assign(req, {url: root + p}), res, data)
						r[Number(req.params.n)] ?
							res.status(200).end(r[Number(req.params.n)]) :
							res.status(400).end()
					})
					log(`GET ${root + p}/:n -> some ${p}\n`)

					app.get(root + p, function(req, res) {
						let r = solve(req, res, data)
						r ?
							res.status(200).end(JSON.stringify(r.slice(0, 99))) :
							res.status(400).end()
					})
					log(`GET ${root + p}/ -> 100 fst ${p}\n`)

					app.get(root + p + '/:n/:m', function(req, res) {
						let r = solve(Object.assign(req, {url: root + p}), res, data)
						r ?
							res.status(200).end(JSON.stringify(r.slice(req.params.n, req.params.m))) :
							res.status(400).end()
					})
					log(`GET ${root + p}/:n/:m -> n to m ${p}\n`)

					// app.get(root + p + '/:id', function (req, res) {
					// 	console.log(`${req.method} ${req.url}`)
					// 	let r = data
					// 	let __ = req.url.split('/').filter(_ => _ != '')
					// 	while (__.length > 0) {
					// 		r = r[__.splice(0, 1)]
					// 		if (r == undefined) {
					// 			res.status(400).end()
					// 			break
					// 		}
					// 	}
					// 	res.status(200).end( JSON.stringify(r, false, "  ") )
					// })

					app.post(root + p, function (req, res) {
						console.log(`${req.method} ${req.url}`)

						let r = data
						let __ = req.url.split('/').filter(_ => _ != '')
						let p = __.splice(0, 1)[0]
						let last_key
						while (p != undefined) {
							r = r[p]
							last_key = p
							p = __.splice(0, 1)[0]
						}
						if (r == undefined)
							return res.status(400).end()

						console.log(req.body)
						if ((tmp = r.find( e => {
							return Object.keys(req.body).find( (k) => {
																					// WOOT ?
								return (Object.keys(e).some(_ => _ == k)) && Object.keys(req.body).reduce( (p,_k) => {
									return p && JSON.stringify(e[_k]) == JSON.stringify(req.body[_k])
								}, true )
							})
						})) && tmp.assigned == false) {
							console.log('found', tmp)
							tmp.assigned = true
							return res.status(202).end( JSON.stringify(tmp) )
						}

						r.push(req.body)
						req.body.id = r.indexOf(req.body)
						req.body.assigned = r.indexOf(req.body)
						req.body.type = last_key

						res.status(201).end( r.indexOf(req.body).toString() )
					})

					log(`GET ${'  '.repeat(level)}${root + p}/:id -> `)
					_gen(schema.items, root + p, p, level + 1)
					log(`\n`)

					log(`GET ${'  '.repeat(level)}${root + p}/ -> [`)
					_gen(schema.items, root + p, p, level + 1)
					log(`${'  '.repeat(level)}]\n`)

					log(`POST ${'  '.repeat(level)}${root + p} -> [`)
					_gen(schema.items, root + p, p, level + 1)
					log(`${'  '.repeat(level)}]\n`)
				}
				else {
					log(`${'  '.repeat(level)}${p} : [ ${schema.items.type} ]`)

					if (root == '/') {
						// CAREFULL
						app.get(root + p, function (req, res) {
							console.log(`${req.method} ${req.url}`)
							let r = data
							let __ = req.url.split('/').filter(_ => _ != '')
							while (__.length > 0) {
								r = r[__.splice(0, 1)]
								if (r == undefined) {
									res.status(400).end()
									break
								}
							}
							if (r.length < 100)
								res.status(200).end( JSON.stringify(r.slice(0, 99), false, "  ") )
							else
								res.status(200).end( JSON.stringify(r, false, "  ") )
						})

						let solve = (req, res, r) => {
							console.log(`${req.method} ${req.url}`)
							let __ = req.url.split('/').filter(_ => _ != '')
							while (__.length > 0) {
								r = r[__.splice(0, 1)]
								if (r == undefined) {
									res.status(400).end()
									break
								}
							}
							return r
						}

						app.get(root + p + '/length', function(req, res) {
							let r = solve(Object.assign(req, {url: root + p}), res, data)
							r ?
								res.status(200).end(r.length.toString()) :
								res.status(400).end()
						})
						log(`GET ${root + p}/length -> Number\n`)


						app.get(root + p + '/last', function(req, res) {
							let r = solve(Object.assign(req, {url: root + p}), res, data)

							r ?
								res.status(200).end(JSON.stringify(r.slice(r.length - 101, r.length - 1))) :
								res.status(400).end()
						})
						log(`GET ${root + p}/last -> 100 last log\n`)

						app.get(root + p + '/last/:n', function(req, res) {
							let r = solve(Object.assign(req, {url: root + p}), res, data)

							r ?
								res.status(200).end(JSON.stringify(r.slice(r.length - Number(req.params.n) - 1, r.length - 1))) :
								res.status(400).end()
						})
						log(`GET ${root + p}/last/:n -> n last log\n`)


						app.get(root + p + '/:n', function(req, res) {
							let r = solve(Object.assign(req, {url: root + p}), res, data)
							r[Number(req.params.n)] ?
								res.status(200).end(r[Number(req.params.n)]) :
								res.status(400).end()
						})
						log(`GET ${root + p}/:n -> some log\n`)

						app.get(root + p, function(req, res) {
							let r = solve(req, res, data)
							r ?
								res.status(200).end(JSON.stringify(r.slice(0, 99))) :
								res.status(400).end()
						})
						log(`GET ${root + p}/ -> 100 fst log\n`)

						app.get(root + p + '/:n/:m', function(req, res) {
							let r = solve(Object.assign(req, {url: root + p}), res, data)
							r ?
								res.status(200).end(JSON.stringify(r.slice(req.params.n, req.params.m))) :
								res.status(400).end()
						})
						log(`GET ${root + p}/:n/:m -> n to m log\n`)

						app.post(root + p, function(req, res) {
							data[p] ? data[p].push(req.body) : data[p] = [ req.body ]
							// console.log(req.body)
							res.status(200).end()
						})
						log(`POST ${root + p} -> some ${p}. Should has a Content-Type: text/plain\n`)
					}

				}
			}
		}
		else
			log(`${'  '.repeat(level)}${p} : ${schema.type}`)
	}
	Object.keys(schema.properties).forEach(k => {
		_gen(schema.properties[k], undefined, k)
		log("")
	})

	fs.writeFileSync('./client/doc.md', doc)
}

f(schema)

app.listen(2121)

regular_save()
