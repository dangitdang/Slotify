//Import all packages
var express = require('express');
var bodyParser = require('body-parser');
var spotifySearch = require('./spotifySearch.js');
var port = process.env.PORT || 8081;
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var makeSlackResponse = function(trackList) {
  var spotifyLink = "https://open.spotify.com/track/";
  var textResponse = '';
  for (var i = 0; i < trackList.length; i++) {
    var track = trackList[i];
    textResponse += ('<' + spotifyLink + track.id + '|' + track.name + '>\n');
  }
  return {'text' : textResponse};
}

var router = express.Router();
router.use(function(req, res, next){
  console.log('Received a request...');
  next();
});

router.get('/', function(req,res) {
    res.json({message: 'Welcome!'});
    res.send('hello!');
});

router.route('/slotify').post(function(req, res) {
  var requestString = req.body.text;
  var slotifyPrefixOffset = ('slotify '.length - 1);
  var artistName = requestString.substring(slotifyPrefixOffset);
  console.log('Performing a search for: ' + artistName);
  spotifySearch.getTracksByArtist(artistName, 5).then(function(trackList) {
    return res.json(makeSlackResponse(trackList));
  }, function(error) {
    return res.json({"error": error});
  });
});

app.use('/api', router);
app.listen(port);
console.log("Slotify is listening on port " + port);
