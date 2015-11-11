angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, $ionicLoading, User, Recommendations) {

  //helper functions for loading
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  //loading for the first time
  showLoading();

  //get our initial songs
  Recommendations.init().then(function(){
    $scope.currentSong = Recommendations.queue[0];
    Recommendations.playCurrentSong();
  }).then(function(){
    // turn off loading
    hideLoading();
    $scope.currentSong.loaded = true;
  });

  // called when favourite / skip buttons is clicked.
  $scope.sendFeedback = function(bool){

    // add to favorites if user favorited
    if(bool) User.addSongToFavorites($scope.currentSong);

    // variables for the correct animation
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    Recommendations.nextSong();

    // time out to allow animation to complete
    $timeout(function(){

      // update current song
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;

    }, 250);

    Recommendations.playCurrentSong().then(function(){
      $scope.currentSong.loaded = true;
    });
  }

  // used for retrieving the next album image
  $scope.nextAlbumImg = function() {
    if(Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }

    return '';
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User) {

  //get the list of favorites from the user service
  $scope.favorites = User.favorites;

  // remove song from favorites
  $scope.removeSong = function(song, index) {
    User.removeSongFromFavorites(song, index);
  }

  $scope.openSong = function(song) {
    $window.open(song.open_url, "_system");
  }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, Recommendations, User) {

  $scope.favCount = User.getFavoriteCount;

  // stop audio when favorites page is selected
  $scope.favouritesSelected = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }

  $scope.leavingFavorites = function() {
    Recommendations.init();
  }

});
