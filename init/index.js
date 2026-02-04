const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const initData = require("./data.js");


const URL = "mongodb://127.0.0.1:27017/travellust";
async function main() {
    await mongoose.connect(URL);
}

main().then(() => {
    console.log("Connected to DB");
})
    .catch((err) => {
        console.log(err);
    })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("inserted successfully");
}

initDB()

// console.log(initData)
