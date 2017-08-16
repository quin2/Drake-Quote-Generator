//AJAX request for random album.
var randomAlbum = 0;
var fetchAlbum = $.ajax({
    url: 'https://api.musixmatch.com/ws/1.1/artist.albums.get?format=jsonp&callback=?&artist_id=33491453&apikey=00da55b15d17746e29c89cacfa46a88e',
    dataType: "jsonp",
    success: function(data){
      var json = data.message.body.album_list;
      var randomAlbumSeed = Math.floor(Math.random() * json.length);
      randomAlbum = json[randomAlbumSeed].album.album_id;
    }
});

// AJAX request for random song from album
randomTrack = 0;
fetchTrack = fetchAlbum.then(function(data) {
  return $.ajax({
    type: "GET",
    url: 'https://api.musixmatch.com/ws/1.1/album.tracks.get?format=jsonp&callback=callback&album_id=' + randomAlbum + '&apikey=00da55b15d17746e29c89cacfa46a88e',
    dataType: "jsonp",
    success: function(data){
      var completeTrackData = data.message.body.track_list;
      var randomSongSeed = Math.floor(Math.random() * completeTrackData.length);
      randomTrack = completeTrackData[randomSongSeed].track.track_id;
   }
  });
});

// AJAX request for lyric line from random song
var lyricGet = "";
fetchLyrics = fetchTrack.then(function(data){
  $.ajax({
    type: "GET",
    url: 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=' + randomTrack + '&apikey=00da55b15d17746e29c89cacfa46a88e',
    dataType: "jsonp",
    success: function(data){
      lyricGet = data;
    }
  });
});

/*
extra code for JQuery overriding, not sure if I need this in future or not
fetchLyrics.done(function(data){
  console.log(data);
});
*/

$(document).ready(function() {
  console.log("ready");
  $("#getQuote").on("click", function(){
    //get lyrics and split into array
    var lyricLine = lyricGet.message.body.lyrics.lyrics_body;
    var splitLyricLine = lyricLine.split(/\n/g);
    
    //pull random lyric from array that isn't a blank line
    var rll = Math.floor(Math.random() * splitLyricLine.length - 4);
    while(splitLyricLine[rll] === ""){//prob wht this line
      rll = Math.floor(Math.random() * splitLyricLine.length - 4);
    }
    var finalQuote = splitLyricLine[rll];
    //update website
    $("#quoteText").html(finalQuote);
    
    //add random drake nickname
    var drakeNickNames = ["Drizzy", "6 God", "Drake", "champagnepapi", "Aubrey Drake Graham", "October's Very Own", "Mr. OVOXO", "Drizzy Drake", "The Youngest Nigga Reppin'", "Wheelchair Jimmy", "The Boy", "Drakkardnoir"];
    var dnnSeed = Math.floor(Math.random() * drakeNickNames.length);
    $("#credit").html(drakeNickNames[dnnSeed]);
    
    //Update twitter
    $("a#tweetLink").attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(finalQuote) + ' -' + drakeNickNames[dnnSeed]);
    
    
  });
});

/*
TODO:
4) make website pretty/minimal with bootstrap
*/