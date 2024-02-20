const express = require("express");
const mongoose = require("mongoose");
const User = require("./db/User");
const cors = require("cors");
const app = express();
const Product = require("./db/product");

const Jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({
        result: "something went wrong , please try after some time",
      });
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  const data = req.body;
  try {
    if (data.password && data.email) {
      let user = await User.findOne({
        email: data.email,
        password: data.password,
      });
      console.log(user, "user");
      if (user) {
        Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
          if (err) {
            res.send({
              result: "something went wrong , please try after some time",
            });
          }
          res.send({ user, auth: token });
        });
      } else {
        res.send({ result: "No User Found" });
      }
    } else {
      res.send({ result: "No User Found" });
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/add-product", varifyToken, async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/products", varifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No products found" });
  }
});

app.delete("/product/:id", varifyToken, async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/product/:id", varifyToken, async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No record found." });
  }
});

app.put("/product/:id", varifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key", varifyToken, async (req, res) => {
  let result = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

function varifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide valid Token " });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "please add token with header" });
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/e-commerce", {
      // Update the connection URL
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL", error);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(5000, () => console.log("Server is running..."));
