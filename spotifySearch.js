var spotify = require('spotify-web-api-node');

module.exports = new function() {
  var spotifyClient = new spotify()
  var spotifyRegion = 'US';

  var getArtistID = function(artistName) {
    var artistsPromise = spotifyClient.searchArtists(artistName);
    return artistsPromise.then(function(data) {
      // TODO(peter): hamming distance to determine which artist is closest to
      // the one being searched-for.
      var artistID = data.artists.items[0].id;
      return artistID;
    });
  };

  this.getTracksByArtist = function(artistName, numberOfTracks) {
    return getArtistID(artistName).then(function(artistID) {
      var tracksPromise = spotifyClient.getArtistTopTracks(
        artistID, spotifyRegion);
      return tracksPromise.then(function(data) {
        var topTracks = [];
        console.log('requested ' + numberOfTracks + ' tracks');
        numberOfTracks = Math.max(
          0, Math.min(numberOfTracks, data.tracks.length));
        console.log('returning ' + numberOfTracks + ' tracks');
        console.log(data.tracks);
        // TODO(peter): why not just take the first numberOfTracks items out of
        // data.tracks?
        for (var i = 0; i < numberOfTracks; i++) {
          topTracks.push({
            'name': data.tracks[i].name,
            'id': data.tracks[i].id,
          });
        }
        console.log(topTracks);
        return topTracks;
      });
    });
  }
};
