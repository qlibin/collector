var express = require('express');
var app = express();

var fs = require('fs');

app.get('/', function(request, response) {
  var bufIndex = fs.readFileSync("index.html");
  response.send(bufIndex.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log("DONE");

});
