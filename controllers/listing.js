const Listing = require("../models/listing");

module.exports.index = async (req,res,next) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
};

module.exports.renderNewForm = (req,res) => { 
  res.render("listings/new");
};

module.exports.showListing = async (req,res,next) =>{
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
};

module.exports.destroyListing = async (req,res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully!");
  res.redirect("/listings");
};

module.exports.updateListing = async (req,res,next) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req,res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.createListing = async (req,res,next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};