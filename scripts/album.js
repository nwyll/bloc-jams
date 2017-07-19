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

 var albumArcadeFire = {
     title: 'The Suburbs',
     artist: 'Arcade Fire',
     label: 'Merge Records',
     year: '2010',
     albumArtUrl: 'assets/images/album_covers/the-suburbs.jpg',
     songs: [
         { title: 'The Suburbs', duration: '5:51' },
         { title: 'Ready to Start', duration: '4:16' },
         { title: 'Modern Man', duration: '4:40'},
         { title: 'Rococo', duration: '3:57' },
         { title: 'Empty Room', duration: '2:52'},
         { title: 'City With No Children', duration: '3:12'},
         { title: 'Half Light I', duration: '4:14'},
         { title: 'Half Light II', duration: '4:27'},
         { title: 'Suburban War', duration: '4:45'},
         { title: 'Month of May', duration: '3:51'},
         { title: 'Wasted Hours', duration: '3:21'},
         { title: 'Deep Blue', duration: '4:28'},
         { title: 'We Use to Wait', duration: '5:01'},
         { title: 'Sprawl I', duration: '2:54'},
         { title: 'Sprawl II', duration: '5:26'},
         { title: 'The Suburbs (continued)', duration: '1:28'}
     ]
 };

 var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number">' + songNumber + '</td>'
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

window.onload = function() {
  setCurrentAlbum(albumPicasso);
};

var albumCover = document.getElementsByClassName('album-cover-art')[0];
var currentAlbum ='picasso';
  albumCover.addEventListener("click", function(event) {
    switch(currentAlbum) {
    case 'picasso':
        setCurrentAlbum(albumMarconi);
        currentAlbum = 'marconi';
        break;
    case 'marconi':
        setCurrentAlbum(albumArcadeFire);
        currentAlbum = 'arcadeFire';
        break;
    case 'arcadeFire':
        setCurrentAlbum(albumPicasso);
        currentAlbum = 'picasso';
        break;
    default:
        setCurrentAlbum(albumPicasso);
        currentAlbum = 'picasso';
        break;
    }
  });
