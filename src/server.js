const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');

const redis = new Redis({
  host: "localhost",
  port: 6379,
  password: null,
});

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
