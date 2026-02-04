const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const { error } = require("console");
const Review = require("../model/review.js");
const Listing = require("../model/listing.js");


const validateReview = (req, res, next) => {
    let { err } = reviewSchema.validate(req.body);
    if (err) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

// reviews section

router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("Review Saved Successfully!");

    res.redirect(`/listings/${req.params.id}`);
}))

//deleting a review

router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/listings/${id}`);
}))


module.exports = router;