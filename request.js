const request = require('request');
request('http://www.naver.com', function (error, response, body) {
  console.log('body:', body); // Print the HTML for the Google homepage.
});