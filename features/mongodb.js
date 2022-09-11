const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@quiztestcluster.3egv76r.mongodb.net/?retryWrites=true&w=majority`;
const dbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const mongodb = dbClient.db("Quiz_test");

module.exports = mongodb;
