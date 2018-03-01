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

let std_response = (res) => (err, data) => {
	if (!err) {
		if (typeof data != 'string')
			res.status(200).end(JSON.stringify(data))
		else
			res.status(200).end(data)
	}
	else
		res.status(400).end(err.toString())
}

exports.root = log => (app, root, p, level) => {
	app.get(root + p, function(req, res) {
		app.redisClient.lrange(`${p}List`, 0, -1, std_response(res))
	})
	log(`GET ${root + p} -> ...\n`)
}

exports.length = log => (app, root, p, level) => {
	app.get(root + p + '/length', function(req, res) {
		app.redisClient.llen(`${p}List`, std_response(res))
	})
	log(`GET ${root + p}/length -> ...\n`)
}

exports.first = log => (app, root, p, level) => {
	app.get(root + p + '/first', function(req, res) {
		app.redisClient.lrange(`${p}List`, 0, 100, std_response(res))
	})
	log(`GET ${root + p}/first -> ...\n`)
}

exports.last = log => (app, root, p, level) => {
	app.get(root + p + '/last', function(req, res) {
		app.redisClient.lrange(`${p}List`, -100, -1, std_response(res))
	})
	log(`GET ${root + p}/last -> ...\n`)
}

exports.nth = log => (app, root, p, level) => {
	app.get(root + p + '/:n', function(req, res) {
		app.redisClient.lrange(`${p}List`, req.params.n, req.params.n, std_response(res))
	})
	log(`GET ${root + p}/:nth -> ...\n`)
}

exports.last_n = log => (app, root, p, level) => {
	app.get(root + p + '/last/:n', function(req, res) {
		app.redisClient.lrange(`${p}List`, -req.params.n, -1, std_response(res))
	})
	log(`GET ${root + p}/last/:nth -> ...\n`)
}

exports.n_m = log => (app, root, p, level) => {
	app.get(root + p + '/:n/:m', function(req, res) {
		app.redisClient.lrange(`${p}List`, req.params.n, req.params.m, std_response(res))
	})
	log(`GET ${root + p}/:n/:m -> ...\n`)
}

exports.push = log => (app, root, p, level) => {
	app.post(root + p, function(req, res) {
		app.redisClient.rpush(`${p}List`, JSON.stringify(req.body), std_response(res))
	})
	log(`POST ${root + p} -> ...\n`)
}
