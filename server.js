require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP
//Imports 
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const item = require('./controllers/mainControllers/itemsController')
const auction = require('./controllers/mainControllers/auctionController')
const open = require("open")

// Middleware
app.use(express.json()); // parse json bodies in the request object

// Redirect requests to endpoint starting with / to postRoutes.js
app.use("/", require("./routes/postRoutes"));

app.use(bodyParser.urlencoded({
  extended: true
}));

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  res.status(500).json({
    message: "Something went wrong",
  });
});

//THis is the sequence to make sure there is fresh call of API's made and loaded into the DB.
item.deleteItems().
  then(auction.deleteAuctions().
    then(auction.loadAuctions().
      then(item.loadItems().
        then(open('http://localhost:8080')))))

// Listen on pc port
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
