const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT | 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function run() {
  try {
    const categoryCollection = client.db("pc-builder").collection("categories");
    const productCollection = client.db("pc-builder").collection("products");

    app.get("/categories", async (req, res) => {
      const categories = await categoryCollection.find({}).toArray();
      res.send(categories);
    });

    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const product = await productCollection.findOne({
        _id: id
      });
      res.send(product);
    });

    app.get("/products-by-category-name/:categoryName", async (req, res) => {
      const categoryName = req.params.categoryName;
      const products = await productCollection
        .find({ category: categoryName })
        .toArray();
      res.send(products);
    });

    app.get("/featured-products", async (req, res) => {
      const products = await productCollection
        .aggregate([{ $sample: { size: 6 } }])
        .toArray();
      res.send(products);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello from pc builder server!");
});
