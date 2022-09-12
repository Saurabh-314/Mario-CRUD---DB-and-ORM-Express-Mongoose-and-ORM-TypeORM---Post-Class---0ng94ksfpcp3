const mongoose = require('mongoose');

//  Your code goes here
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
});

const marioModel = mongoose.model('User', schema);

module.exports = marioModel;
// module.exports = mongoose.model('User', schema);;