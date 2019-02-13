
let mysql = require("mysql");
let express = require("express");

let app = express();

let connection = mysql.createConnection({
  host: "localhost",
  user: "HYF",
  password: "password",
  database: "new_world"
});

connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("connected");
});

//query from database .. print result into brawser.
//What is the capital of country X ? (Accept X from user)
app.get("/query/country/:countryName", (req, res) => {
  console.log(req.params.countryName);
  let query = `select name from city where id = (select capital from country where name = "${
    req.params.countryName
  }")`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.send(JSON.stringify({ result }));
  });
});

//List all the languages spoken in the region Y (Accept Y from user)
app.get("/query/region/:region", (req, res) => {
  console.log(req.params.region);
  let query = `select DISTINCT language from CountryLanguage where CountryCode in (select Code from country where Region = "${
    req.params.region
  }")`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.send(JSON.stringify({ result }));
  });
});

//Find the number of cities in which language Z is spoken (Accept Z from user)
app.get("/query/city/:language", (req, res) => {
  console.log(req.params.language);
  let query = `select count(*) from city where CountryCode in (select CountryCode from countryLanguage where language = "${
    req.params.language
  }")`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.send(JSON.stringify({ result }));
  });
});
//question four
app.get(
  "/query/countryRegion/:country/:lang/:isOff",
  (req, res) => {
    console.log(req.params.country);
    let query = `select name from country where region in (select region from country where name = "${
      req.params.country
    }" AND code in (select CountryCode from CountryLanguage where Language = "${
      req.params.lang
    }" AND isOfficial = "${req.params.isOff}"))`;
    connection.query(query, (err, result) => {
      if (err) throw err;
      //console.log(result);
      res.send(JSON.stringify({ result }));
    });
  }
);

//List all the continents with the number of languages spoken in each continent
app.get("/query/continent", (req, res) => {
  console.log(req.params.language);
  let query = `select continent, count(language) AS languages_number from countryLanguage, country where CountryCode in (select Code from country order by continent) and countryCode=code GROUP BY continent`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.send(JSON.stringify({ result }));
  });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});



