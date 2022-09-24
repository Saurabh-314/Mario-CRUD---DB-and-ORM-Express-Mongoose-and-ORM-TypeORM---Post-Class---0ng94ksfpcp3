const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testaroo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('connection established')
}).on('connectionError', (err) => {
  console.log(err);
})

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/mario', async (req, res) => {
  const result = await marioModel.find();
  res.status(200).json(result);
})

app.get('/mario/:id', async (req, res) => {
  const paramId = req.params.id;
  try {
    const result = await marioModel.findOne({ "_id": paramId });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.post('/mario', async (req, res) => {
  const data = new marioModel(req.body);
  try {
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: 'either name or weight is missing' });
  }
})

app.patch('/mario/:id', async (req, res) => {
  const paramId = req.params.id;
  const data = new marioModel(req.body);

  try {
    if (data.name && data.weight) {
      const result = await marioModel.updateOne(
        { '_id': paramId },
        { $set: { 'name': data.name, 'weight': data.weight } }
      )
      res.json(result);
    }
    else if (data.name) {
      const result = await marioModel.updateOne(
        { '_id': paramId },
        { $set: { 'name': data.name } }
      )
      res.json(result);
    }
    else if (data.weight) {
      const result = await marioModel.updateOne(
        { '_id': paramId },
        { $set: { 'weight': data.weight } }
      )
      res.json(result);
    }
    else {
      res.status(400).json({ message: "field are missing" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.delete('/mario/:id', async (req, res) => {
  const paramId = req.params.id;
  try {
    await marioModel.deleteOne({ "_id": paramId });
    res.status(200).json({ message: 'character deleted' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = app;