const express = require("express");
const cors = require("cors");
const dbConfig =require("./config/db.config")
const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family :4
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
   
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


  require('./routes/auth.routes')(app);
  require('./routes/user.routes')(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my App" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});