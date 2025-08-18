const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListing, isOwner  } = require("../middleware.js");

//index route
router.get("/",validateListing, wrapAsync(async (req,res,next) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
}));

//new route
router.get("/new", isLoggedIn, (req,res) => { 
  res.render("listings/new");
});

//show route
router.get("/:id", wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");
  if(!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));

//Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req,res,next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

//update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully!");
  res.redirect("/listings");
}));

module.exports = router;