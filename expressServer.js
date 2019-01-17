const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
let  urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
"9sm5xK": "http://www.google.com"
};

const userDatabase = {
    "user": {
    id: "user",
    email: "user@example.com",
    password: "purplemonkeydinosaur"
  },
 "user2": {
    id: "user2",
    email: "user2@example.com",
    password: "dishwasherfunk"
  }
};


const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');


//new urls
app.get("/urls/new", (req, res) => {
  let templateVars = {username: req.cookies["username"]}

  res.render("urlsNew");
});

//all urls
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, username: req.cookies["username"]};

  res.render("urlsIndex", templateVars);
});

//redirect to the long url using the short url
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  let templateVars = {users: userDatabase};

  res.render('register', templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"]};

  res.render("urlsShow", templateVars);
});

app.post("/register", (req, res) => {
  res.redirect('http://localhost:8080/urls');
});

//logouts the user
app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect(`http://localhost:8080/urls`);
});

//logins the user
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect(`http://localhost:8080/urls`);
});
//delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`http://localhost:8080/urls`);
});

//edit the long url
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect(`http://localhost:8080/urls`);
});

//add url to database
app.post("/urls", (req, res) => {
  // console.log(req.body);
  let shortURL = urlGeneration();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body><b>Hello World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function urlGeneration(){
  randomNumber =  Math.floor(100000000 + Math.random() * 90000000);
  return randomNumber.toString(36);
}

