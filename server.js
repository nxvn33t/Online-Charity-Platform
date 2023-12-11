import express from "express";
import { config } from 'dotenv';
import path from 'path';
// import {connectdb} from "./data/database.js";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import { authenticator } from 'otplib';
import nodemailer from 'nodemailer';


const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(path.resolve(), "public")))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); // Add CORS middleware for cross-origin requests
app.use(cookieParser());

// connectdb();
mongoose.connect('mongodb://127.0.0.1/charityuser', {}
  );
  mongoose.connection.on('connected', () => {
    console.log('Database connected');
  });


  const saltRounds = 10;

config({
  path: "./data/config.env",
});

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'yogeshgandwaa@gmail.com',
//     pass: 'zeubhhskledrbcfh ',
//   },
// });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otpSecret: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
  res.render("index", { titel: 'Index' });
})

app.get("/login", (req, res) => {
  res.render("login", { titel: 'Login' });
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.send('Login Successful');
    } else {
      res.render("login", {
        title: "Login",
        errorMessage: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.get("/signup", (req, res) => {
  res.render("signup", { titel: 'Signup' });
})


app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
      const user = await User.findOne({ email });

      if (user) {
          return res.status(400).render("signup", {
              title: "Signup",
              errorMessage: "User already exists",
          });
      }

      if (password === confirmPassword) {
          const newUser = new User({ username, email, password });
          await newUser.save();
          res.send('Registration Successful');
      } else {
          return res.status(400).render("signup", {
              title: "Signup",
              errorMessage: "Passwords do not match",
          });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


app.get("/about", (req, res) => {
  res.render("about", { titel: 'About' });
})

app.get("/donate", (req, res) => {
  res.render("donate", { titel: 'Donate' });
})

app.get("/thankyou", (req, res) => {
  res.render("thankyou", { titel: 'Thankyou' });
})

app.get("/expend_dog", (req, res) => {
  res.render("expend_dog", { titel: 'Expend' });
})

console.log(process.env.PORT);

app.listen(process.env.PORT, () => {
  console.log(`Server started at : ${process.env.PORT}`)
})