//INITIAL SETUP

//Import all packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var spotifySearch = require('./spotifySearch.js');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;


var router = express.Router();

router.use(function(req,res, next){
    console.log('Received a request...');
    next();
});

router.get('/', function(req,res) {
    res.json({message: 'Welcome!'});
    res.send('hello!');
});
router.route('/slotify')

    .post(function (req, res) {
        var rawRequest = req.body.text;
        var artist = rawRequest.substring(rawRequest.indexOf(':')+2);
        console.log(artist);
        console.log('Searching for artist...');
        spotifySearch.queryToID(artist, function(ID){
            spotifySearch.getTopTracks(ID, function(list){
                res.json(resMaker(list));
            });
        });
});

function resMaker(trackList) {
    var spotifyLink = "https://open.spotify.com/track/";
    var respond = {
        "text":""
    };
    var textRespond = "";
    for(var i = 0; i < 5; i++){
        textRespond += (trackList[i].name + " " + "<"+spotifyLink + trackList[i].id+">"+"\n");
    }
    respond.text = textRespond;
    return respond;

}


app.use('/api', router);

app.listen(port);
console.log('Getting sexy at port ' + port);
