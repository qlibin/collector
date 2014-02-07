#!/usr/bin/env node

var express = require('express'),
    fs = require('fs'),
    article = require('./routes/articles');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.get('/', function(request, response) {
  var bufIndex = fs.readFileSync("index.html");
  response.send(bufIndex.toString());
});

//app.get('/articles', articles.findAll);
//app.get('/articles/:id', articles.findById);

app.get('/articles', article.findAll);
app.get('/articles/:id', article.findById);
app.post('/articles', article.addArticle);
app.put('/articles/:id', article.updateArticle);
app.delete('/articles/:id', article.deleteArticle);

app.get('/articles/test/insert-data', article.populateTestData);
app.get('/articles/find-by-hash/:hash', article.findByHash);

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
  console.log("DONE");

});
