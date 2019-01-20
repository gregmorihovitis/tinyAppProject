const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(cookieSession({
  name: 'userId',
  keys: ['key1']
}));


const urlDatabase = {
};

const userDatabase = {
};


//new urls
app.get("/urls/new", (req, res) => {
  let templateVars = {user: userDatabase[req.session.userId]}

  if(req.session.userId === undefined){
    res.redirect('http://localhost:8080/login');
  }


  res.render("urlsNew", templateVars);
});

//all urls
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase, user: userDatabase[req.session.userId]};

  res.render("urlsIndex", templateVars);
});

//redirect to the long url using the short url
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: userDatabase[req.session.userId]};

  if(req.session.userId === undefined){
    res.redirect('http://localhost:8080/login');
  }else if(req.session.userId !== urlDatabase[req.params.id].userId){
    res.send('That link doesnt belong to you!');
  }

  res.render("urlsShow", templateVars);
});


//end of get / start of psot


app.post("/login", (req, res) => {
  let validEmail = false;
  let validPassword = false;

  for(user in userDatabase){
    if(userDatabase[user].email === req.body.email){
      validEmail = true;

      if(bcrypt.compareSync(req.body.password, userDatabase[user].password)){
        validPassword = true;
        req.session.userId = userDatabase[user].id;
        break;
      }
    }
  }


  if(!validEmail || !validPassword){
    res.status(400).send('Sorry, incorrect email or password.');
  }
    res.redirect('http://localhost:8080/urls');
});

app.post("/register", (req, res) => {
  let randomId = urlGeneration();
  let invalid = false;

  for(user in userDatabase){
    if(userDatabase[user].email === req.body.email){
      invalid = true;
      break;
    }

    invalid = false;
  }

  if(req.body.email === "" || req.body.password === ""){
    res.status(400).send('Sorry, blank email or password.');
  }

  else if(invalid === true){
    res.status(400).send('Sorry, that email is already in use.');
  }

  else{
    req.session.userId = randomId;
    userDatabase[randomId] = {id: randomId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
    res.redirect('http://localhost:8080/urls');
  }
});

//logouts the user
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`http://localhost:8080/urls`);
});

//logins the user
app.post("/login", (req, res) => {
  req.session.userId = req.body.userId;
  res.redirect(`http://localhost:8080/urls`);
});
//delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`http://localhost:8080/urls`);
});

//edit the long url
app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = { longURL: req.body.newLongURL, userId: req.session.userId};
  res.redirect(`http://localhost:8080/urls`);
});

//add url to database
app.post("/newURL", (req, res) => {
  let shortURL = urlGeneration();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userId: req.session.userId};
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

