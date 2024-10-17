const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = require("mongodb");

dotenv.config();

app.use(bodyParser.json());
app.use(cors());

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "AquaLock";

client.connect();

//get passwords
app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

//save passwords
app.post("/", async (req, res) => {
  const { site, username, password } = req.body;
  console.log(site, username, password);
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.insertOne({ site, username, password });
  // res.json({ insertedId: findResult.insertedId });
  res.send({ success: true, result: findResult });
});

//delete passwords
app.delete("/", async (req, res) => {
  const { id } = req.body;
  console.log(id);
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.deleteOne({ _id: new ObjectId(id) });
  res.send({ success: true, result: findResult });
});

app.listen(8080, () => {
  console.log(`app listening on port 8080`);
});
