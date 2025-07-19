const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const { title } = require("process");

main()
.then(() => {
  console.log("connection to DB");
})
.catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
  console.log("server is working");
});

app.get("/testListing", async (req, res) =>{
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
  res.send("successful testing");
});

app.post("/")

port = 8080;
app.listen(port, () => {
  console.log(`app is listening to port:${port}`);
});