const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load routing
require('./routes/index')(app);

app.use((err, req, res, next) => {
  res.status(500);
  res.json({ error: err });
  console.log(err);
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
