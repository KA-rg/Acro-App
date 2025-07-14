const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

main()
.then(() => {
  console.log("connection successful");
})
.catch((err) => {
  console.log(err);
})

async function main() {
  await mongoose.connect("mongodb://localhost:27017/whatsapp");
}

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
  console.log("server is working");
});



port = 8080;
app.listen(port, () => {
  console.log(`app is listening to port:${port}`);
})