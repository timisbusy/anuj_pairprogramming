var twitter = require('ntwitter')
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

server.listen(3000);


var twit = new twitter({
  consumer_key: 'KGTxDvum7VOvnwQfTSxx8A',
  consumer_secret: 'mi19n2PWx0MAP1D2MSpmfywG9W7pm9H4CosfNpo',
  access_token_key: '27296169-m7YsY5UPiFwltVZ2EjxF1pg99Vjryc8BDbCfFXOy9',
  access_token_secret: 'cbTMWI8bZ4bc3Dz6ZfymdY6ASqWk3WBKHyfnQj8pd8'
});

/*
twit
  .verifyCredentials(function (err, data) {
    console.log(data);
  });
*/

function getWordList() 
{
  var wordListString = '';
  var wordList = ['food', 'lunch', 'dinner',
                  'eating', 'ate', 'breakfast',
                  'snack', 'eat', 'delicious', 'tasty', 
                  'dessert'];
  for (var i = 0; i < wordList.length; ++i)
  {
    wordListString += wordList[i] + ',';
  }
  wordListString = wordListString.substring(0, wordListString.length-1);
  return wordListString;
}


var wordL = getWordList();

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});



var wordCloudList = 
  [
    'pizza', 'coffee', 'cheetos', 'chicken wing', 'quasedia',
    'twinkies', 'marshmellows', 'chip', 'almonds', 'peanuts',
    'rice', 'soup', 'steak', 'hamburger', 'hot dog', 'noodle',
    'squid', 'grouper', 'fries', 'salad'
  ];

function getMatchedWords(text)
{
  var retList = [];
  if (text == undefined || text == null)
    return retList;
  for(var i = 0; i < wordCloudList.length; ++i)
  {
      var newRegex = new RegExp(wordCloudList[i], 'i');
      if(text.match(newRegex))
      {
        retList.push(wordCloudList[i]);
      }
  } 
  return retList;
}

io.sockets.on('connection', function (socket) {
  
  twit.stream('statuses/filter', {'track':wordL}, function(stream) {
    stream.on('data', function (data) {
      var matchedWords = getMatchedWords(data.text);
      try
      {
      socket.emit('twitter', { tweet: data.text, words: matchedWords, 
                               user: data.user.name, id: data.id_str});
      }
      catch(e){}
    });
  });

});