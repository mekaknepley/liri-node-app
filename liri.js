
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");

// fs is a core Node package for reading and writing files
var fs = require("fs");

var keys = require('./keys.js');

var paramAction = process.argv[2];
var paramArgument = process.argv[3];

var textFile = "log.txt";
 
//console.log('Param: ' + paramAction);

function outputText(string) {
	console.log(string);
	fs.appendFile(textFile, string + "\n", function(error) {
		if (error) {
			console.log(error);
		}
	});
}

if (paramAction == "do-what-it-says") {
	//console.log("I'm going to open random.txt using fs and then execute the commands there");
	
	var text = fs.readFileSync('random.txt','utf8')
	//console.log(text);
	var textParams = text.split(",");

	// overwrite paramAction with the first item
	paramAction = textParams[0];
	if (textParams.length > 1) {
	// overwrite paramArgument with the second item
		paramArgument = textParams[1];
	}
}

if (paramAction == "my-tweets") {
	//console.log("I'm going to read 20 tweets here");

	//console.log(keys.twitterKeys);

	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'mekaknepley', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    //console.log(tweets);
	    for (var i = 0; i < tweets.length; i++) {
	    	outputText("\"" + tweets[i].text + "\" at " + tweets[i].created_at);
	    }
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
		outputText("Artist(s): " + artistNames);
		outputText("Song: " + songName);
		outputText("Preview URL: " + previewUrl);
		outputText("Album: " + albumName);
	});
}
else if (paramAction == "movie-this") {
	//console.log("Look up movie here");
 	if (paramArgument == undefined || paramArgument.length == 0) {
 		paramArgument = "Mr. Nobody";
 	}

 	var apiKey = "b30c550";
 	// API key recieved doesn't seem to work yet
 	apiKey = "40e9cece";
	var queryURL = "http://www.omdbapi.com/?t=" + encodeURIComponent(paramArgument) + "&y=&plot=short&apikey=" + apiKey;
	request(queryURL, function(error, response, body) {

		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {

			var movieInfo = JSON.parse(body);

			outputText("Title: " + movieInfo.Title);
			outputText("Year: " + movieInfo.Year);
			outputText("IMDB Rating: " + movieInfo.imdbRating);
			outputText("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
			outputText("Country: " + movieInfo.Country);
			outputText("Language: " + movieInfo.Language);
			outputText("Plot: " + movieInfo.Plot);
			outputText("Actors: " + movieInfo.Actors);
		}
		else
		{
			if (error) {
				console.log(error);
			}
			console.log(response.statusCode);
		}
	});
}
else {
	outputText("Unrecognized command! Acceptable commands are: my-tweets, spotify-this-song, movie-this, and do-what-it-says.");
}