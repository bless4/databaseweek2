let mysql = require("mysql");
let express = require("express");
let JSAlert = require("js-alert");

let app = express();

let connection = mysql.createConnection({
  host: "localhost",
  user: "HYF",
  password: "",
  multipleStatements: true,
  database: "new_world"
});

connection.connect(err => {
  if (err) {
    throw err;
  }
  console.log("connected");
});

app.get("/query/countrylanguage/:code", (req, res) => {
  console.log(req.params.code);
  let query = `INSERT INTO countrylanguage 
  (countrycode, language, isOfficial) VALUES ("${
    req.params.code
  }", 'Arabic', 'T');`;

  let q2 = `select count(language) AS languageNumber 
  from countryLanguage where countryCode = "${
    req.params.code
  }"`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    //console.log(result);
    res.send(JSON.stringify({ result }));
    connection.query(q2, (err, result) => {
      if (err) throw err;
      //console.log(result);
      if (result[0].languageNumber >= 10) {
        JSAlert.alert(
          "How can I achieve this .. 10 or more LANGS ?"
        );
      } else {
        JSAlert.alert("Less than 10 LANGS");
      }
    });
  });
});

app.listen("3000", () => {
  console.log("Server started on port 3000");
});