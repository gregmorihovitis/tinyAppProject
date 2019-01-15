let express = require("express");
let app = express();
let PORT = 8080;
let  urlDatabase = [
{"b2xVn2": "http://www.lighthouselabs.ca"},
{"9sm5xK": "http://www.google.com" }
];
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/urls/new", (req, res) => {
  res.render("urlsNew");
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

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body><b>Hello World</b></body></html>\n");
// });

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

function urlGeneration(){
  randomNumber =  Math.floor(100000000 + Math.random() * 90000000);
  return randomNumber.toString(36);
}

