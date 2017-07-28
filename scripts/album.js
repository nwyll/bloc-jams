var setSong = function(songNumber) {
    currentPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
  return  $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {

  var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

  var $row = $(template);

  var clickHandler = function() {

	var $songNumber = parseInt($(this).attr('data-song-number'));

  // A song is playing. Find the current playing cell and switch it to song number.
  //This applys if you are switching songs
	if (currentPlayingSongNumber !== null) {
		var currentlyPlayingCell = getSongNumberCell(currentPlayingSongNumber);
		currentlyPlayingCell.html(currentPlayingSongNumber);
	}
  // Switch from Play -> Pause button to indicate new song is playing.
	if (currentPlayingSongNumber !== songNumber) {
		$(this).html(pauseButtonTemplate);
    setSong($songNumber);
    updatePlayerSongBar();
  }
  // Switch from Pause -> Play button to pause currently playing song.
	else if (currentPlayingSongNumber === $songNumber) {
		$(this).html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    setSong(null);
	}

};

  var onHover = function(event) {
    var $songNumberCell = $(this).find('.song-item-number');
    var $songNumber = parseInt($songNumberCell.attr('data-song-number'));

    if($songNumber !== currentPlayingSongNumber) {
      $songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var $songNumberCell = $(this).find('.song-item-number');
    var $songNumber = parseInt($songNumberCell.attr('data-song-number'));

    if ($songNumber !== currentPlayingSongNumber) {
      $songNumberCell.html($songNumber);
    };

  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};

var setCurrentAlbum = function(album) {

  currentAlbum = album;

  //Select all HTML element required to display album
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  //set above varibles with values from the current album
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  //clear album song list to make sure there is not interference
  $albumSongList.empty();

  //loop throught the song list and add them to the HTML
  for(var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow( i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }

};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function(album, song) {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex ++;

  if (currentSongIndex >= currentAlbum.songs.length) { currentSongIndex = 0;}

  var lastSongNumber = currentPlayingSongNumber;

  setSong(currentSongIndex + 1);
  updatePlayerSongBar();

  var $nextSongNumberCell = getSongNumberCell(currentPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function(album, song) {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex --;

  if (currentSongIndex < 0) { currentSongIndex = currentAlbum.songs.length - 1; }

  var lastSongNumber = currentPlayingSongNumber;

  setSong(currentSongIndex + 1);
  updatePlayerSongBar();

  var $previousSongNumberCell = getSongNumberCell(currentPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var updatePlayerSongBar = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);

};

//Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//Initialize current song and album
var currentAlbum = null;
var currentPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')


$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
