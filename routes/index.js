var express = require('express');
var router = express.Router();

var Feedparser = require('feedparser'),
    request = require('request');

var req = request(),
    feedparser = new Feedparser({});

req.on('error', function (error) {
    console.log("Error: " + error.toString());
});

req.on('response', function (res) {
    var newsStream = this;
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IS IT OK TODAY?' });
});

module.exports = router;
