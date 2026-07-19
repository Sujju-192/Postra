import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";

dotenv.config();

const PASSWORD = "12345";
const START = 50;
const END = 100;

const indianNames = [
  { firstName: "Arjun", lastName: "Sharma" },
  { firstName: "Priya", lastName: "Patel" },
  { firstName: "Rohan", lastName: "Singh" },
  { firstName: "Ananya", lastName: "Kumar" },
  { firstName: "Vikram", lastName: "Reddy" },
  { firstName: "Kavya", lastName: "Iyer" },
  { firstName: "Aditya", lastName: "Gupta" },
  { firstName: "Isha", lastName: "Mehta" },
  { firstName: "Karan", lastName: "Joshi" },
  { firstName: "Neha", lastName: "Nair" },
  { firstName: "Rahul", lastName: "Verma" },
  { firstName: "Pooja", lastName: "Das" },
  { firstName: "Amit", lastName: "Banerjee" },
  { firstName: "Divya", lastName: "Rao" },
  { firstName: "Suresh", lastName: "Pillai" },
  { firstName: "Lakshmi", lastName: "Menon" },
  { firstName: "Harish", lastName: "Chopra" },
  { firstName: "Meera", lastName: "Kapoor" },
  { firstName: "Sanjay", lastName: "Malhotra" },
  { firstName: "Ritu", lastName: "Bose" },
  { firstName: "Deepak", lastName: "Saxena" },
  { firstName: "Shreya", lastName: "Agarwal" },
  { firstName: "Manish", lastName: "Trivedi" },
  { firstName: "Anjali", lastName: "Mishra" },
  { firstName: "Nikhil", lastName: "Pandey" },
  { firstName: "Swati", lastName: "Dubey" },
  { firstName: "Gaurav", lastName: "Srivastava" },
  { firstName: "Tanvi", lastName: "Chauhan" },
  { firstName: "Varun", lastName: "Thakur" },
  { firstName: "Nidhi", lastName: "Bhatt" },
  { firstName: "Ashok", lastName: "Yadav" },
  { firstName: "Kiran", lastName: "Desai" },
  { firstName: "Rajesh", lastName: "Shah" },
  { firstName: "Sunita", lastName: "Gandhi" },
  { firstName: "Vivek", lastName: "Kulkarni" },
  { firstName: "Preeti", lastName: "Shetty" },
  { firstName: "Anil", lastName: "Bhatia" },
  { firstName: "Rekha", lastName: "Saini" },
  { firstName: "Mohit", lastName: "Gill" },
  { firstName: "Aarti", lastName: "Chawla" },
  { firstName: "Sunil", lastName: "Dutta" },
  { firstName: "Pallavi", lastName: "Hegde" },
  { firstName: "Rakesh", lastName: "Nambiar" },
  { firstName: "Sneha", lastName: "Kaur" },
  { firstName: "Prakash", lastName: "Tripathi" },
  { firstName: "Vidya", lastName: "Sinha" },
  { firstName: "Harsh", lastName: "Bhardwaj" },
  { firstName: "Komal", lastName: "Rathore" },
  { firstName: "Yogesh", lastName: "Tiwari" },
  { firstName: "Bhavna", lastName: "Jain" },
  { firstName: "Siddharth", lastName: "Mukherjee" },
  { firstName: "Aishwarya", lastName: "Chatterjee" },
];

async function connect() {
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) throw new Error("MONGODB_URI is not defined");

  const uri = new URL(rawUri);
  const hasDb =
    uri.pathname && uri.pathname !== "/" && uri.pathname.trim() !== "";
  const finalUri = hasDb
    ? rawUri
    : `${rawUri.replace(/\/+$/, "")}/${DB_NAME}`;

  await mongoose.connect(finalUri);
}

async function seed() {
  await connect();

  let created = 0;
  let skipped = 0;

  for (let n = START; n <= END; n++) {
    const userName = `user${n}`;
    const exists = await User.findOne({ userName });
    if (exists) {
      skipped++;
      continue;
    }

    const name = indianNames[n - START];
    const genders = ["male", "female", "other"];

    await User.create({
      userName,
      password: PASSWORD,
      email: `${userName}@postra.seed`,
      firstName: name.firstName,
      lastName: name.lastName,
      gender: genders[n % 3],
    });
    created++;
  }

  console.log(`Done. Created: ${created}, skipped (already exist): ${skipped}`);
  console.log(`Usernames: user${START} … user${END}, password: ${PASSWORD}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
