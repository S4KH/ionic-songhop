angular.module('songhop.services', [])

.factory('Recommendations', function ($http, SERVER, $q) {

  // used for previewing song
  var media;

  var o = {
    queue: []
  };

  o.playCurrentSong = function() {
    var defer = $q.defer();

    // play the current song's preview
    media = new Audio(o.queue[0].preview_url);

    // when song is loaded, resolve the promise to let controller know
    media.addEventListener("loadeddata", function() {
      defer.resolve();
    });

    media.play();

    return defer.promise;
  }

  // used when switching to favorites tab
  o.haltAudio = function() {
    if(media) media.pause();
  }

  o.init = function() {

    //songs queue is empty, fill it
    if(o.queue.length ===0) {
      return o.getNextSongs();
    } else {
      // otherwise, play the current
      return o.playCurrentSong();
    }
  }

  // Getting songs from server
  o.getNextSongs = function() {
    return $http({
      method: 'GET',
      url: SERVER.url+'/recommendations'
    }).success(function(data){
      // add data into the queue
      o.queue = o.queue.concat(data);
    });
  }

  // used for skipping song
  o.nextSong = function() {
    // pop the index 0 off
    o.queue.shift();

    // pause the song
    o.haltAudio();

    // number of songs in the queue is less, fill it up
    if(o.queue.length <=3) {
      o.getNextSongs();
    }
  }

  return o;
})
.factory('User', function() {

  var o = {
    favorites: [],
    newFavorites: 0
  }

  // add song to favorites
  o.addSongToFavorites = function(song) {
    // check if there is song to add
    if(!song) return false;

    o.favorites.unshift(song);
    o.newFavorites++;
  }

  o.getFavoriteCount = function() {
    return o.newFavorites;
  }

  // remove from favorites
  o.removeSongFromFavorites = function(song, index) {

    //check if there is song to remove
    if(!song) return false;

    o.favorites.splice(index, 1);
  }

  return o;
});
