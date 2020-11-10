const express = require("express")
const app = express()

app.set("views", __dirname + "/views"); //ejs 를 사용하기위한 디렉토리 설정
app.set("view engine", "ejs"); //ejs 를 사용하기위한 뷰 엔진 설정
 
app.get("/", function (req, res) {
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
