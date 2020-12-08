const express = require("express");
const app = express();
const path = require("path");

app.set("views", __dirname + "/views"); //ejs 를 사용하기위한 디렉토리 설정
app.set("view engine", "ejs"); //ejs 를 사용하기위한 뷰 엔진 설정

app.use(express.json()); //JSON 타입의 데이터를 받기위한 설정
app.use(express.urlencoded({extended: false})); //urlencoded 타입의 데이터를 받기위한 설정

app.use(express.static(path.join(__dirname, "public")));
//to use static asset 디자인 파일 위치를 정의
 
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});




app.listen(3000);
