const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

const port = process.env.PORT || 4200;

app.listen(port, () => {
  console.log(`Application listening on port ${port}.`);
});
