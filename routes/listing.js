const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner  } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//index route
router.get("/",validateListing, wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;