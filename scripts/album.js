var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time) {
  if(currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if(currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return  $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {

  var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerSongBar();
  }
  // Switch Pause -> Play button when clicking on currently playing song.
	else if (currentPlayingSongNumber === $songNumber) {
    if(currentSoundFile.isPaused()) {
      $(this).html(pauseButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPauseButton);
      currentSoundFile.play();
    } else {
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      currentSoundFile.pause();
    }
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

var updateSeekBarWhileSongPlays = function() {
  if(currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(this.getTime());
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);


  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    if($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex ++;

  if (currentSongIndex >= currentAlbum.songs.length) { currentSongIndex = 0;}

  var lastSongNumber = currentPlayingSongNumber;

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerSongBar();

  var $nextSongNumberCell = getSongNumberCell(currentPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex --;

  if (currentSongIndex < 0) { currentSongIndex = currentAlbum.songs.length - 1; }

  var lastSongNumber = currentPlayingSongNumber;

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerSongBar();

  var $previousSongNumberCell = getSongNumberCell(currentPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);

};

var togglePlayFromPlayerBar = function() {
  var songNumberCell = getSongNumberCell(currentPlayingSongNumber);

  if(currentSoundFile.isPaused()) {
		songNumberCell.html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
  } else if (currentSoundFile) {
    songNumberCell.html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var updatePlayerSongBar = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  $('.total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
  var time = parseFloat(timeInSeconds);
  var wholeMinutes = Math.floor(time / 60);
  var wholeSeconds = Math.floor(time - (wholeMinutes * 60));

  if(wholeSeconds < 10){
    var formattedSeconds = '0' + wholeSeconds;
  } else {
    formattedSeconds = wholeSeconds;
  }

  return wholeMinutes + ":" + formattedSeconds;
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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')
var $playerBarPlayPauseButton = $('.main-controls .play-pause');


$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});
