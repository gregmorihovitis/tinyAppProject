let express = require("express");
let app = express();
let PORT = 8080;
let  urlDatabase = [
{ shortened: "b2xVn2", original: "http://www.lighthouselabs.ca"},
{ shortened: "9sm5xK", original: "http://www.google.com" }
];

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let urlObjs = { urls: urlDatabase };

  res.render("urlsIndex", urlObjs);
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