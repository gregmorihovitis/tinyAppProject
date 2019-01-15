let express = require("express");
let app = express();
let PORT = 8080;
let  urlDatabase = [
{"b2xVn2": "http://www.lighthouselabs.ca"},
{"9sm5xK": "http://www.google.com" }
];

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let urlObjs = { urls: urlDatabase };

  res.render("urlsIndex", urlObjs);
});

app.get("/urls/:id", (req, res) => {
  let keyIndex = findObj(urlDatabase, req.params.id);
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase, keyIndex: keyIndex};

  res.render("urlsShow", templateVars);
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

function findObj(objArray, key){
  let keyIndex = 0;

  for(urls of objArray){
    if (urls[key]){
      keyIndex = objArray.indexOf(urls);
    }
  }

  return keyIndex;
}