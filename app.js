const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
// const Listing = require("./model/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const { error } = require("console");
const Review = require("./model/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");

const URL = "mongodb://127.0.0.1:27017/travellust";
async function main() {
    await mongoose.connect(URL);
}
main().then(() => {
    console.log("Connected to DB");
})
    .catch((err) => {
        console.log(err)
    })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



app.get("/", (req, res) => {
    res.send("Hi iam Root");
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.status(status).render("listings/error.ejs", { message });
})

app.listen(port, () => {
    console.log(`Listening on port no : ${port}`);
})