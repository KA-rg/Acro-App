const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { types } = require("joi");

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
  
  image: {
  filename: String,
  url: String
},

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({ _id: { $in: listing.review }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;