const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const initialSetup = require("./util/initialSetup");
const dbConfig = require("./config/db.config");

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:4200" // Allow your Angular app to connect
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initialSetup(); // Initialize roles
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MEAN Auth application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});