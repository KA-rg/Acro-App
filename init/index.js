const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");


main()
.then(() => {
  console.log("connection to DB");
})
.catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68a17d8afdf656c4a2663c81",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
};

initDB();