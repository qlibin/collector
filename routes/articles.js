/**
 * Created by alibin on 2/7/14.
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('articlesdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'articledb' database");
        db.collection('articles', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'articles' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.populateTestData = function(req, res) {
    console.log('populateTestData');
    populateDB();
    res.send({result: "OK"});
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving article: ' + id);
    db.collection('articles', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByHash = function(req, res) {
    var hash = req.params.hash;
    console.log('Retrieving article: ' + hash);
    db.collection('articles', function(err, collection) {
        collection.findOne({hash: hash}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('articles', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addArticle = function(req, res) {
    var article = req.body;
    console.log('Adding article: ' + JSON.stringify(article));
    db.collection('articles', function(err, collection) {
        collection.insert(article, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateArticle = function(req, res) {
    var id = req.params.id;
    var article = req.body;
    console.log('Updating article: ' + id);
    console.log(JSON.stringify(article));
    db.collection('articles', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, article, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating article: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(article);
            }
        });
    });
};

exports.deleteArticle = function(req, res) {
    var id = req.params.id;
    console.log('Deleting article: ' + id);
    db.collection('articles', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var articles = [
        {
            name: "article1",
            link: "http://libin.org.ru/wkjlskds",
            hash: "767872347238",
            text: "articletext",
            target: {name: 'appleTv', keywords: ['apple tv', 'appletv', 'atv']},
            keywords: ['apple tv'],
            comment: "some comment",
            ext: "place for other info"
        },
        {
            name: "article2",
            link: "http://libin.org.ru/amnmqsas",
            hash: "9387276876232",
            text: "articletext",
            target: {name: 'piano', keywords: ['пианин', 'фортепиан', 'синтезатор', 'midi', 'миди']},
            keywords: ['пианин', 'фортепиан'],
            comment: "some comment",
            ext: "place for other info"
        }
    ];

    db.collection('articles', function(err, collection) {
        collection.insert(articles, {safe:true}, function(err, result) {});
    });

};

