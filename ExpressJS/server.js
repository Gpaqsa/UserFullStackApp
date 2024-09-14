const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/user");
const app = express();

const PORT = 3001;
app.use(express.json());
app.use(cors());
// How to connect to Database with mongodb
const URI =
  "mongodb+srv://adminPaksa:paksa1234@crud-app-cluster.iytxnfs.mongodb.net/UserDb?retryWrites=true&w=majority&appName=Crud-App-Cluster";

mongoose
  .connect(URI)
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Failed to connect to Databse", err);
  });

// Get all User Data
app.get("/users", (req, res) => {
  User.find()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

// Create (POST) a new user
app.post("/users", (req, res) => {
  const { name, lastname, email } = req.body; 

  if (!name || !email) {
    return res
      .status(400)
      .json({ message: "Missing required fields: name and email" });
  }

  const newUser = new User({ name, lastname, email });

  newUser
    .save()
    .then((savedUser) => res.status(201).json(savedUser)) 
    .catch((error) => {
      console.error("Error creating user:", error);
      res.status(400).json({ message: "Error creating user" });
    });
});

// Get Unique ID of Unique User
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" }); 
      }
      return user;
    })
    .then(user => {
      res.json(user)
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});
