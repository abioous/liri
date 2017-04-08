
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var twitter = new Twitter(keys.twitterKeys);
var spotify = require('spotify');
var request = require('request');



function showMyTweets() {
	logCommand()
	twitter.get('statuses/user_timeline', {count:20}, function(error, tweets, response) {
  			if(error) throw error;
  			for(var i = 0; i< tweets.length;i++) {
  				console.log("'" + tweets[i].text + "'" +' created at ' + tweets[i].created_at)
  			}
	});

}


function showSongInfo(song) {
	spotify.search({ type: 'track', query: song}, function(err, data) {
    	if ( err ) {
        	console.log('Error occurred: ' + err);
        	return;
    	}
    	if(data.tracks && data.tracks.items && data.tracks.items.length > 0) {
			var item = data.tracks.items[0];
    		var artists = '';
    		for(var j = 0;j<item.artists.length;j++) {
    			if(artists.length > 0) artists += ', '; 
    			artists += item.artists[j].name
    		}

    		console.log('Artists: ' + artists) 
    		console.log('Song name: ' + item.name);
    		console.log('Preview url: ' +  item.preview_url);
    		console.log('Album: ' +item.album.name )
    	}
  
	});
}


function showMovieInfo(movie) {
	request('http://www.omdbapi.com/?type=movie&t=' + movie, function (error, response, body) {
  		if(error) {
  			throw error;
  		}
  		var data = JSON.parse(body);
  		console.log('Title: ' + data.Title);
  		console.log('Release Year: ' + data.Year);
  		console.log('Rating: ' + data.Ratings[0].Source + ' ' + data.Ratings[0].Value);
  		console.log('Counttry: ' + data.Country);
  		console.log('Language: ' + data.Language);
		console.log('Plot: ' + data.Plot);
		console.log('Actors: ' + data.Actors);
		console.log('Rating: ' + data.Ratings[1].Source + ' ' + data.Ratings[1].Value);
  		console.log('Url: ' + data.Poster);
	});
}

function readRandomText() {
	var data = fs.readFileSync("random.txt", "utf8")
	return data;
}


function logCommand(command, argument) {
	 fs.appendFile("log.txt", command +"," + argument+"\n", 'utf8');
}


function runCommand(command, argument) {

	switch(command) {
		case 'my-tweets':
			showMyTweets();
			break;
		case 'spotify-this-song':
			if(!argument) {
				argument = '"The Sign" by Ace of Base';
			}
			showSongInfo(argument);
			break;
		case 'movie-this':
			if(! argument) {
				argument = 'Mr. Nobody';
			}
			showMovieInfo(argument);

			break;
		case 'do-what-it-says':
			arguments = readRandomText().split(",");
			runCommand(arguments[0], arguments[1]);
			return
	}
	logCommand(command, argument);
}

var command = process.argv[2];
var argument = process.argv.length > 3 ? process.argv[3] : null;
			
runCommand(command, argument);


//http://img.omdbapi.com/?apikey=[yourkey]&