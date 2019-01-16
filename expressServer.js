let express = require("express");
let app = express();
let PORT = 8080;
let  urlDatabase = {
"b2xVn2": "http://www.lighthouselabs.ca",
"9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//new urls
app.get("/urls/new", (req, res) => {
  res.render("urlsNew");
});

//all urls
app.get("/urls", (req, res) => {
  let urlObjs = {urls: urlDatabase};

  res.render("urlsIndex", urlObjs);
});

//redirect to the long url using the short url
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};

  res.render("urlsShow", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  let shortURL = urlGeneration(); // debug statement to see POST parameters
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`http://localhost:8080/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
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

