const express = require("express")
const app = express()
 
app.get("/", function (req, res) {
  //이곳에 다양한 로직들을 채울 예정...

  res.send("Hello World");
});

//라우터 추가해보기
app.get("/hello", function (req, res) {
    res.send("Hello 2");
});

app.get("/user", function (req, res) {
    res.send("user Data");
});

app.listen(3000);
