var twitter = require('ntwitter')

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


var wordList = ['food', 'lunch', 'dinner',
                'eating', 'ate', 'breakfast',
                'snack', 'eat', 'delicious', 'tasty', 
                'dessert'];
wordListString = '';
for (var i = 0; i < wordList.length; ++i)
{
  wordListString += wordList[i] + ',';
}
wordListString = wordListString.substring(0, wordListString.length-1);

console.log(wordListString);

twit.stream('statuses/filter', {'track':wordListString}, function(stream) {
  stream.on('data', function (data) {
    console.log(data.text);
  });
});
