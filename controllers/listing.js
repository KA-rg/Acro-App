const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  let { search } = req.query;

  let allListing;
  if (search) {
    // case-insensitive search on title or location (example)
    allListing = await Listing.find({
      $or: [
        { title: new RegExp(search, "i") },
        { location: new RegExp(search, "i") }
      ]
    });
  } else {
    allListing = await Listing.find({});
  }

  res.render("listings/index", { allListing, search });
};

module.exports.renderNewForm = (req,res) => { 
  res.render("listings/new");
};

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
};


module.exports.updateListing = async (req,res,next) =>{
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_25,h_25");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    next(err);
  }
};

module.exports.createListing = async (req,res,next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.destroyListing = async (req,res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully!");
  res.redirect("/listings");
};