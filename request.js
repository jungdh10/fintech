const request = require('request');
request(
  "https://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109",
  function (error, response, body) {
    console.log("body:", body);
  }
);