const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');

let redis = null;

if (process.env.REDIS_SEARCH_URL){
  redis = new Redis({
    host: process.env.REDIS_SEARCH_URL,
    port: process.env.REDIS_SEARCH_PORT,
    password: process.env.REDIS_SEARCH_PASS
  });
}
else{
  redis = new Redis({
    host: "localhost",
    port: "6379",
    password: ""
  });
}

app.use(session({
  secret: 'CapOne',
  name: 'RediTeam',
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({
    client: redis,
    prefix: `session:`,
  })
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);



const port = process.env.PORT || 4200;

app.listen(port, () => {
  console.log(`Application listening on port ${port}.`);
});
