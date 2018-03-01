const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const generics = require('./generics.js')

var redis = require("redis"),
    client = redis.createClient();

app.use(bodyParser.json())
app.use(bodyParser.text())

app.redisClient = client

function load(path, _) {
	return fs.existsSync(path) ? require(path) : _
}
function save(path, _) {
	return s.writeFileSync(path, JSON.stringify(_))
}
// let data = load('./data.json', {})
// let data = {}

// let regular_save = () => {
// 	console.log('saved data.json')
// 	save('./data.json', data)
// 	setTimeout(regular_save, 60000)
// }

// tmp ??
// data.watchers ? data.watchers.forEach(e => e.assigned ? e.assigned = false : null) : null

let schema = load('./schema.json')

// var Ajv = require('ajv')
// var ajv = new Ajv({allErrors: true}) // options can be passed, e.g. {allErrors: true}
// var validate = ajv.compile(schema)
// if (!validate(data))
// 	console.log(validate.errors)

let doc = ''
let log = (...args) => {
	args.forEach( e => doc += e + '\n' )
	// console.log.apply(null, args)
}

app.get('/', function(req, res) {
	res.status(200).end(fs.existsSync('./client/index.html') ? fs.readFileSync('./client/index.html') : "")
})
log('GET / -> client/index.html\n')

// app.get('/data', function(req, res) {
// 	res.send(JSON.stringify(Object.keys(data).reduce( (p,k) => {
// 		if (k != 'log')
// 			p[k] = data[k]
// 		return p
// 	}, {}), false, "  "))
// })
// log('GET /data -> ' + JSON.stringify(schema, false, "  ") + '\n')
//
// app.post('/register', function(req, res, next){
// 	if (!req.body.type.match(/(\w+)\//) || !data[req.body.type.match(/(\w+)\//)[1]] )
// 		res.status(400).end()
// 	else {
// 		req.url = '/' + req.body.type.match(/(\w+)\//)[1]
// 		console.log(req.url)
// 		return app._router.handle(req, res, next)
// 	}
// })
// log('[WIP] POST /register -> some bot\n')
//
// app.post('/unregister', function(req, res, next){
// 	console.log('unregister')
// 	console.log(req.body)
// 	if (!req.body.type.match(/(\w+)\//) || !data[req.body.type.match(/(\w+)\//)[1]] )
// 		res.status(400).end()
// 	else {
// 		let tmp = data[ req.body.type.match(/(\w+)\//)[1] ].find( e => {
// 			return Object.keys(req.body).find( (k) => {
// 																	// WOOT ?
// 				return (Object.keys(e).some(_ => _ == k)) && Object.keys(req.body).reduce( (p,_k) => {
// 					return p && JSON.stringify(e[_k]) == JSON.stringify(req.body[_k])
// 				}, true )
// 			})
// 		})
// 		tmp.assigned = false
// 		res.status(200).end()
// 		save('./data.json', data)
// 	}
// })
// log('[WIP] POST /unregister -> some bot\n')

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
					// if (!data[p])
					// 	data[p] = []

					// Object.keys(generics).forEach(k => {
					// 	generics[k] (log) (app, data, root, p, level)
					// })

					// app.post(root + p, function (req, res) {
					// 	console.log(`${req.method} ${req.url}`)
					//
					// 	let r = data
					// 	let __ = req.url.split('/').filter(_ => _ != '')
					// 	let p = __.splice(0, 1)[0]
					// 	let last_key
					// 	while (p != undefined) {
					// 		r = r[p]
					// 		last_key = p
					// 		p = __.splice(0, 1)[0]
					// 	}
					// 	if (r == undefined)
					// 		return res.status(400).end()
					//
					// 	console.log(req.body)
					//
					// 	if ((tmp = r.find( e => {
					// 		return Object.keys(req.body).find( (k) => {
					// 																// WOOT ?
					// 			return (Object.keys(e).some(_ => _ == k)) && Object.keys(req.body).reduce( (p,_k) => {
					// 				return p && JSON.stringify(e[_k]) == JSON.stringify(req.body[_k])
					// 			}, true )
					// 		})
					// 	})) && tmp.assigned == false) {
					// 		console.log('found', tmp)
					// 		tmp.assigned = true
					// 		return res.status(202).end( JSON.stringify(tmp) )
					// 	}
					//
					// 	r.push(req.body)
					// 	req.body.id = r.indexOf(req.body)
					// 	req.body.assigned = true // r.indexOf(req.body)
					// 	// req.body.type = last_key
					//
					// 	res.status(201).end( r.indexOf(req.body).toString() )
					// })
				}
				else {
					// log(`${'  '.repeat(level)}${p} : [ ${schema.items.type} ]`)

					if (root == '/') {
						Object.keys(generics).forEach(k => {
							generics[k] (log) (app, root, p, level)
						})
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

// regular_save()
