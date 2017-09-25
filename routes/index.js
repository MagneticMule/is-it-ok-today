var express = require('express');
var router = express.Router();

var Feedparser = require('feedparser');
var request = require('request');

var sentiment = require('sentiment');

var runningScore = 0;

var req = request('https://news.google.co.uk/news?cf=all&hl=en&ned=uk&output=rss');

// Some feeds do not respond without user-agent and accept headers.
req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
req.setHeader('accept', 'text/html,application/xhtml+xml');

var feedparser = new Feedparser();

req.on('error', function (error) {
    console.log('Error: ' + error);
});

// successful request
req.on('response', function (res) {
    var newsStream = this;

    // TODO: Return errors specific to HTTP status codes
    if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
        console.log('Error, bad status code' + res.statusCode.toString());
    } else {
        newsStream.pipe(feedparser);
    }
});

feedparser.on('error', function (error) {
    // always handle errors
    console.log('error parsing feed: ' + error.toString());
});


feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this
        , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
        , item;


    while (item = stream.read()) {
        console.log(item.title);
        console.log('----------');
        console.log(sentiment(item.title).score);
        runningScore += sentiment(item.title).score;
    }
    console.log('Final Score: ' + runningScore);
});


/* GET home page. */
router.get('/', function (req, res, next) {
    if (runningScore > 0) {
        res.render('index', {title: 'It is Good Today!', message: 'YES'});
    } else if (runningScore === 0) {
        res.render('index', {title: 'It is Neither Good nor Bad Today', message: 'OK'});
    } else if (runningScore < 0) {
        res.render('index', {title: 'It is Not Good today', message: 'NO'});
    }
});

module.exports = router;
