const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bf5r1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const activitiesCollection = client
      .db("volunteer-network")
      .collection("activities");
    const registrationCollection = client
      .db("volunteer-network")
      .collection("registrations");

    app.get("/activity", async (req, res) => {
      const query = {};
      const cursor = activitiesCollection.find(query);
      const activities = await cursor.toArray();
      res.send(activities);
    });

    app.get("/activity/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const activity = await activitiesCollection.findOne(query);
      res.send(activity);
    });

    app.post("/register", async (req, res) => {
      const registerItem = req.body;
      const result = await registrationCollection.insertOne(registerItem);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Volunteer Network Server is LIVEE!");
});

app.listen(port, () => {
  console.log("Listening to port:", port);
});
