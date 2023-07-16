require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euxm4cs.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
const uri = "mongodb://localhost:27017"; // Replace <port> with the port number
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    const db = client.db("assignment5");
    const booksCollection = db.collection("books");
    const reviewCollection = db.collection("reviews");

    app.get("/books", async (req, res) => {
      const cursor = booksCollection.find({});
      const books = await cursor.toArray();

      res.send({ status: true, data: books });
    });

    app.post("/book", async (req, res) => {
      const book = req.body;
      console.log(book);
      const result = await booksCollection.insertOne(book);
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollection.findOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.patch("/book/:id", async (req, res) => {
      const bookID = req.params.id;
      const book = req.body;

      const result = await booksCollection.findOneAndUpdate(
        { _id: ObjectId(bookID) },
        { $set: book },
        { returnOriginal: false }
      );

      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
