var express = require("express");
var app = express();
// Server to navigate the text highlighter website and run the tests.

app.use(express.static(".")); //Serves resources from test folder

var server = app.listen(5002, () => {
  console.log("Listening on port 5002");
});
