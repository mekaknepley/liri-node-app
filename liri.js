
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
// fs is a core Node package for reading and writing files
var fs = require("fs");

var keys = require('./keys.js');

var paramAction = process.argv[2];
var paramArgument = process.argv[3];
 
console.log('Param: ' + paramAction);

if (paramAction == "do-what-it-says") {
	console.log("I'm going to open random.txt using fs and then execute the commands there");
	
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  // We will then print the contents of data
	  console.log(data);

	});

	// overwrite paramAction with the first item

	// overwrite paramArgument with the second item
}

if (paramAction == "my-tweets") {
	console.log("I'm going to read 20 tweets here");

	console.log(keys.twitterKeys);

	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'mekaknepley'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);
	  }
	});

}
else if (paramAction == "spotify-this-song") {
 
 	if (paramArgument == undefined || paramArgument.length == 0) {
 		paramArgument = "'The Sign' by Ace of Base";
 	}

	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});
	 
	spotify.search({ type: 'track', query: paramArgument }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 
		//console.log(data);
		//console.log(data.tracks.items[0].artists[0]); 
		//console.log(data.tracks.items[0]); 

		var artists = data.tracks.items[0].artists;
		var songName = data.tracks.items[0].name;
		var previewUrl = data.tracks.items[0].preview_url;
		var albumName = data.tracks.items[0].album.name;

		var artistNames = "";
		for (var i = 0; i < artists.length; i++) {
			artistNames += artists[i].name;
			if (i != artists.length - 1) {
				artistNames += ", ";
			}
		}
		console.log("Artist(s): " + artistNames);
		console.log("Song: " + songName);
		console.log("Preview URL: " + previewUrl);
		console.log("Album: " + albumName);
	});
}
else if (paramAction == "movie-this") {
	console.log("Look up movie here");
}
else {
	console.log("Unrecognized command! Acceptable commands are: my-tweets, spotify-this-song, movie-this, and do-what-it-says.");
}