const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/proposals", (req, res)=>{
    res.render("proposals");
});

app.get("/members", (req, res)=>{
    res.render("members");
});

app.get("/petitions", (req, res)=>{
    res.render("petitions");
});

app.get("/contact", (req, res)=>{
    res.render("contact");
});

app.get("*", (req, res)=>{
    res.render("error");
});

app.listen(3000, ()=>{
    console.log("Running on port 3000");
});