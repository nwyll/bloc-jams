var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
 };

 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
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

    var $songNumber = $(this).attr('data-song-number');

    //if a song is not currently playing then you are clicking to play the song, so change the button to pause
    if (currentPlayingSong === null) {
      $(this).html(pauseButtonTemplate);
      currentPlayingSong = $songNumber;
    }
    //else if the current song playing is the one you are clicking then you are clicking to pause the song, so change the button to play
    else if (currentPlayingSong === $songNumber) {
      $(this).html(playButtonTemplate);
      currentPlayingSong = null;
    }
    //else the currently playing song is not the one you are   clicking on, ie: you want to change songs
    else if (currentPlayingSong !== $songNumber) {
      var currentPlayingSongElement = document.querySelector('[data-song-number="' + currentPlayingSong +'"]');
      //currentPlayingSongElement = song number of the currently playing song
      //when clicked you are swithching to play another some so change the current song's play button back to the song number
      currentPlayingSongElement.innerHTML = currentPlayingSongElement.getAttribute('data-song-number');
      //below sets the new song choosen to the pause button
      $(this).html(pauseButtonTemplate);
      //now current song number is data-song-number from the item clicked
      currentPlayingSong = $songNumber;
    }

  };

  var onHover = function(event) {
    var $songNumberCell = $(this).find('.song-item-number');
    var $songNumber = $songNumberCell.attr('data-song-number');

    if($songNumber !== currentPlayingSong) {
      $songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var $songNumberCell = $(this).find('.song-item-number');
    var $songNumber = $songNumberCell.attr('data-song-number');

    if ($songNumber !== currentPlayingSong) {
      $songNumberCell.html($songNumber);
    };
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};

var setCurrentAlbum = function(album) {

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

//Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentPlayingSong = null;

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
});
