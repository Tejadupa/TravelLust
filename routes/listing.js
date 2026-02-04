const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");


// server side validation using joi 
const validateListing = (req, res, next) => {
    let { err } = listingSchema.validate(req.body);
    if (err) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}


// index route 
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

// edit route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/update.ejs", { listing });
}));
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`)
}));

// delete route
router.get("/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("This was the deleted Listing");
    console.log(deletedListing)
    res.redirect("/listings")
}));

// new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

// show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

module.exports = router;