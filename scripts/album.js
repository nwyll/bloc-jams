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

    return template;
};

var setCurrentAlbum = function(album) {
  //Select all HTML element required to display album
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  //set above varibles with values from the current album
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  //clear album song list to make sure there is not interference
  albumSongList.innerHTML = '';

  //loop throught the song list and add them to the HTML
  for(var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
  }
};

//Find Parent By Class Name
var findParentByClassName = function(element, targetClass) {
  if(element) {
    //sets curent parent as the parent of the element passed
    var currentParent = element.parentElement;
    //while the current parent does not = the target classs we are searching for and is not null, then move up to the next parent element
    while(currentParent.className !== targetClass && currentParent.className !== null) {
    currentParent = currentParent.parentElement;
    }
  }
  return currentParent;
};

//Get Song Item
var getSongItem = function(element) {

};


//Click handler
var clickHandler = function(targetElement) {

  var songItem = getSongItem(targetElement);

  if (currentPlayingSong === null) {
    songItem.innerHTML = pauseButtonTemplate;
    currentPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentPlayingSong === songItem.getAttribute('data-song-number') {
    songItem.innerHTML = playButtonTemplate;
    currentPlayingSong = null;
  } else if (currentPlayingSong !== songItem.getAttribute('data-song-number') {
    var currentPlayingSongElement = document.querySelector('[data-song-number="' + currentPlayingSong +'"]');
    currentPlayingSongElement.innerHTML = currentPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
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

  songListContainer.addEventListener('mouseover', function(event) {
    // Only target individual song rows during event delegation
    if(event.target.parentElement.className === 'album-view-song-item') {
      // Changes the content from the number to the play button's HTML
      event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
    }
  });
  

  for(var i = 0; i < songRows.length; i++) {
    //On mouseleave the playbutton reverts back to the song number
    songRows[i].addEventListener('mouseleave', function(event){
      //Selects firstChild element of songRows, which is the song-item-number element
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
    });

    //On click change the current value of the song
    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }
}
