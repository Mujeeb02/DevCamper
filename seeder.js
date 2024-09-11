const fs = require("fs");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/BootCamp");
const Courses = require("./models/Course");
const User=require('./models/User')
const Review=require('./models/Review')


mongoose.connect(process.env.MONGO_URI);

// read json files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/courses.json`, "utf-8")
);

const users=JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);

const reviews=JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Courses.create(courses);
    await User.create(users);
    await Review.create(reviews)
    console.log("data created".green);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Courses.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("data destroyed".green);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if(process.argv[2]==='-i'){
    importData();
}
else if(process.argv[2]==='-d'){
    deleteData()
}
