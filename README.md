This is the supervisor part, which should allow you to register
to a computing cluster responding to a same schema.

`npm install ; node_modules/bower/bin/bower install ; sh get_redis `

- ` sh run.sh `

  this command loads the server and somes files, schema.json and optionally data.json.
  it builds a bunch of `get` and `post` routes to be able to manage communication over great distances.
  you might find a dirty documentation of those @ client/doc.md
  it start off a redis server if the redis client didn't found a connection.

- ` redis-4.0.8/src/redis-server `
  start off a redis server
