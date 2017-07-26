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

    return $(template);
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

//Finds the parent element of a given element that matches the target class name
var findParentByClassName = function(element, targetClass) {

  //check if there is an element
  if(element) {
    //sets curent parent as the parent of the element passed
    var currentParent = element.parentElement;
    //while the current parent does not = the target classs we are searching for (and is not null), then move up to the next parent element
    while(currentParent.className !== targetClass && currentParent.className !== null) {
    currentParent = currentParent.parentElement;
    }
  }
  return currentParent;
};

//Get Song Item: return the element that has class ="song-item-number" when you are anywhere on the row
var getSongItem = function(element) {

  switch (element.className) {
    //if the element class is the song-item-number, great thats what we are looking for, return the element
    case 'song-item-number':
      return element;
    //if the element class is the title or duration (the other two cells on the row), then find the parent (the row) then search the parent row for the song-item-number
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    //if the class is the song button, play or pause, those are children of the song-item-number cell, so just find the parent and return it
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    //if the class is the album-view-song-item, then thats the row, search the row for the song-item-number
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    default:
      return;
  }

};

//Click handler
var clickHandler = function(targetElement) {

  var songItem = getSongItem(targetElement);

  //if a song is not currently playing then you are clicking to play the song, so change the button to pause
  if (currentPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentPlayingSong = songItem.getAttribute('data-song-number');
  //else if the current song playing is the one you are clicking then you are clicking to pause the song, so change the button to play
} else if (currentPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentPlayingSong = null;
  //else the currently playing song is not the one you are clicking on, ie: you want to change songs
} else if (currentPlayingSong !== songItem.getAttribute('data-song-number')) {
    var currentPlayingSongElement = document.querySelector('[data-song-number="' + currentPlayingSong +'"]');
    //currentPlayingSongElement = song number of the currently playing song
    //when clicked you are swithching to play another some so change the current song's play button back to the song number
    currentPlayingSongElement.innerHTML = currentPlayingSongElement.getAttribute('data-song-number');
    //below sets the new song choosen to the pause button
    songItem.innerHTML = pauseButtonTemplate;
    //now current song number is data-song-number from the item clicked
    currentPlayingSong = songItem.getAttribute('data-song-number');
  }

};

//Elements that will have event listeners
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

//Play & Pause Buttons
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentPlayingSong = null;

window.onload = function() {
  setCurrentAlbum(albumPicasso);

  //My Solution
  /*songListContainer.addEventListener('mouseover', function(event) {

    //gets the song item number cell from the element the mouse is over
     var songItem = getSongItem(event.target);
     //if it is not the current song then change the number to the playbutton
     if(songItem.getAttribute('data-song-number') !== currentPlayingSong) {
       //Targets each song rows during event delegation
       if(event.target.parentElement.className === 'album-view-song-item') {
         // Changes the content from the number to the play button's HTML
         songItem.innerHTML = playButtonTemplate;
       }
    }

  });*/

  //Bloc solution
  songListContainer.addEventListener('mouseover', function(event) {
    if (event.target.parentElement.className === 'album-view-song-item') {
      var songItem = getSongItem(event.target);

      if (songItem.getAttribute('data-song-number') !== currentPlayingSong) {
        songItem.innerHTML = playButtonTemplate;
      }
    }
   });

  for(var i = 0; i < songRows.length; i++) {
    //On mouseleave the playbutton reverts back to the song number
    songRows[i].addEventListener('mouseleave', function(event){

      //gets the song item number cell from the element the mouse left
      var songItem = getSongItem(event.target);
      //song item number is set to the value from data-song-number attribute from the song item number cell from the element the mouse left
      var songItemNumber = songItem.getAttribute('data-song-number');

      //if the song is not playing and the mouse leaves, change the play button back to a number
      if (songItemNumber !== currentPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
    });

    //On click change the current value of the song
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
}
