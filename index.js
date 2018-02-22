const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json())

let load = (path, _) => fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : _
let save = (path, _) => fs.writeFileSync(path, JSON.stringify(_))
let data = load('./data.json', {})

// tmp ??
data.watchers ? data.watchers.forEach(e => e.assigned ? e.assigned = false : null) : null

let schema = load('./schema.json')

let doc = ''
let log = (...args) => {
	args.forEach( e => doc += e + '\n')
	console.log.apply(null, args)
}

app.get('/', function(req, res) {
	res.status(200).end(fs.existsSync('./client/index.html') ? fs.readFileSync('./client/index.html') : "")
})
log('GET / -> client/index.html\n')

app.get('/data', function(req, res) {
	res.send(JSON.stringify(data, false, "  "))
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
				return (Object.keys(e).some(_ => _ == k)) && JSON.stringify(e[k]) == JSON.stringify(req.body[k])
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
				console.log(`${'  '.repeat(level)}${p} : {`)
			Object.keys(schema.properties).forEach(k => {
				if ((root).split('/').reverse()[0] != p)
					_gen(schema.properties[k], root, k, level + 1)
				else
					_gen(schema.properties[k], root, k, level + 1)
			})
			if (p)
			console.log(`${'  '.repeat(level)}}`)
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
						res.status(200).end( JSON.stringify(r, false, "  ") )
					})
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
							tmp.assigned = tmp.id
							return res.status(202).end( JSON.stringify(tmp) )
						}


						r.push(req.body)
						req.body.id = r.indexOf(req.body)
						req.body.assigned = r.indexOf(req.body)
						req.body.type = last_key

						res.status(201).end( r.indexOf(req.body).toString() )
						save('./data.json', data)
					})

					log(`[WIP] GET ${'  '.repeat(level)}${root + p}/:id -> [`)
					_gen(schema.items, root + p, p, level + 1)
					log(`${'  '.repeat(level)}]\n`)

					log(`POST ${'  '.repeat(level)}${root + p} -> [`)
					_gen(schema.items, root + p, p, level + 1)
					log(`${'  '.repeat(level)}]`)
				}
				else {
					log(`${'  '.repeat(level)}${p} : [ ${schema.items.type} ]`)
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

console.log(data)

var Ajv = require('ajv')
var ajv = new Ajv({allErrors: true}) // options can be passed, e.g. {allErrors: true}
var validate = ajv.compile(schema)
if (!validate(data))
	console.log(validate.errors)

app.listen(2121)
