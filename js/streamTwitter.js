var socket = io.connect('http://localhost:3000');
var wordMap = {}
var maxCount = 0; minCount = 0;
var totalOccur = 0;
var maxDisplayedTweets = 100;
var tweetIds = [];
function getSize(wordMap, word)
{
  var count = wordMap[word];
  var size = 10.0 + 80.0 * (count - minCount) / (maxCount - minCount)
  return size;
}
function resizeAll(wordMap)
{
  for (var k in wordMap)
  {
    var idTag = '#' + k;
    $(idTag).css({'font-size': getSize(wordMap, k)});
  }
}
socket.on('twitter', function (data) {
  var words = data.words;
  for(var i = 0; i < words.length; ++i)
  {
    totalOccur += 1;
    var currentWord = words[i];
    var idTag = '#' + currentWord;
    if(wordMap[currentWord] == undefined)
    {
      $('#wordCloud').append("<div class='pull-left' style='padding: 10px;' id='" + currentWord  + "'>" + "<a href='http://foursquare.com/explore?q=" + currentWord + "'>" + currentWord + '</a></div>');
      wordMap[currentWord] = 1;
    }
    else
    {
      wordMap[currentWord] += 1;
    }
    if(wordMap[currentWord] >= maxCount)
    {
      maxCount = wordMap[currentWord];
    }
    if(wordMap[currentWord] <= minCount)
    {
      minCount = wordMap[currentWord];
    }
    resizeAll(wordMap);

  }

  $('#tweets').prepend("<div class='span12' id='" + data.id + "'><span class='label label-info' style='margin-right: 10px'>" + data.user + ": </span>" + data.tweet + '</div>');
  tweetIds.push(data.id);
  if(tweetIds.length > maxDisplayedTweets)
  {
    removeTweet = tweetIds.shift();
    $('#' + removeTweet).remove();
  }
});
