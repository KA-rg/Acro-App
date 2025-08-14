const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressErrors = require("../utils/ExpressErrors.js");
const { listingSchema } = require('../schema.js');
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(400, errMsg);  //server side validation
  } else {
    next();
  }
};

//index route
router.get("/",validateListing, wrapAsync(async (req,res,next) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
}));

//new route
router.get("/new", (req,res) =>{ 
  res.render("listings/new");
});

//show route
router.get("/:id",validateListing, wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show", { listing });
}));

//Create Route
router.post("/",validateListing, wrapAsync(async (req,res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",validateListing, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

//update route
router.put("/:id",validateListing, wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",validateListing, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;