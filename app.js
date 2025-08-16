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
// const req = require("express/lib/request.js");
const { listingSchema,reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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