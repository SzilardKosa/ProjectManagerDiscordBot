const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/discordbot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
