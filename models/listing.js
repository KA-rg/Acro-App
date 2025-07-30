const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
  title:{ 
    type: String,
    require: true,
  },
  description:{
    type: String,
  },
  // image: {
  //   type: String,
  //   set: (v) =>
  //     v === ""
  //       ? "https://unsplash.com/photos/a-person-standing-in-a-narrow-canyon-between-two-mountains-lrhF4w-KKjA"
  //        : v,
  // },
  image: {
  filename: String,
  url: String
},

  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;