var spotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new spotifyWebApi();

var region = 'US';

function spotifySearch(artistQuery, callback){
    var artistID;
    spotifyApi.searchArtists(artistQuery)
        .then(function(data) {
            artistID = data.artists.items[0].id;
            callback(artistID);
        }, function(err) {
            console.error(err);
        });

}

function trackSearch(ID, callback) {
    spotifyApi.getArtistTopTracks(ID,region)
        .then(function(data){
            var topTracks=[];
            for(var i =0;i < 5; i++){
                var tracksAdd = {
                    'name' : data.tracks[i].name,
                    'id' : data.tracks[i].id
                };
                topTracks.push(tracksAdd);
            }
            console.log(topTracks);
            callback(topTracks);
        }, function(err) {
            console.log(err);
        });
}

module.exports.queryToID= spotifySearch;
module.exports.getTopTracks= trackSearch;
