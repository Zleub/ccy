var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

let start = 27064
let f = (i) => {
	client.lrange('tmpList', 0, -1, (err, res) => {
		res.forEach(e => client.rpush("logList", e))
		console.log('end')
	})
}

f(start)
