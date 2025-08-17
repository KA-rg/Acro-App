module.exports.isLoggedIn = ( req, res, next) => {
  if(!req.isAuthenticated()) {
    req.flash("error", "Listing you requested does not exists!");
    return res.redirect("/login");
  }
  next();
}