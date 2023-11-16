import express from "express";
import {config} from 'dotenv';
import path from 'path';


const app= express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(path.resolve(), "public")))

config({
    path: "./data/config.env",
 }); 

 app.get("/", (req,res)=>{
    res.render("index", {titel:'Index'});
 })

 app.get("/login", (req,res)=>{
    res.render("login", {titel:'Login'});
 })

 app.get("/signup", (req,res)=>{
    res.render("signup", {titel:'Singup'});
 })

 app.get("/about", (req,res)=>{
    res.render("about", {titel:'About'});
 })

app.listen(process.env.PORT, ()=>{
    console.log(`Server started at : ${process.env.PORT}`)
})