const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const req = require("express/lib/request.js");
const { listingSchema,reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");

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

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(400, errMsg);  //server side validation
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(400, errMsg);  //server side validation
  } else {
    next();
  }
};

//index route
app.get("/listings",validateListing, wrapAsync(async (req,res,next) => {
  const allListing = await Listing.find({});
  res.render("listings/index", { allListing });
}));

//new route
app.get("/listings/new", (req,res) =>{ 
  res.render("listings/new");
});

//show route
app.get("/listings/:id",validateListing, wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show", { listing });
}));

//Create Route
app.post("/listings",validateListing, wrapAsync(async (req,res,next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

//update route
app.put("/listings/:id",validateListing, wrapAsync(async (req,res,next) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",validateListing, wrapAsync(async (req,res,next) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//Reviews
//POST Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${id}`);
}));

//DELETE Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

// app.get("/testListing", async (req, res) =>{
  //   let sampleListing = new Listing({
    //     title: "My New Villa",
    //     description: "By the beach",
    //     price: 1200,
    //     location: "Calangute, Goa",
    //     country: "India",
    //   });
    //   res.send("successful testing");
    // });
    
   // 1. All routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// 2. Catch-all for undefined routes
// app.all("*", (req, res, next) => {
//   next(new ExpressErrors(404, "Page not found"));
// });

// 3. Error handler at the very end
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error", { err });
});

port = 8080;
app.listen(port, () => {
  console.log(`app is listening to port:${port}`);
});