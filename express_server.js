const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var jwt = require("jsonwebtoken");
var tokenKey = "k!2f#$%%^1223^jlfejlkjfdaskejlkjflkj";
var auth = require("./lib/auth");

//MYSQL 커넥터 추가
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "********", //본인 비밀번호
  database: "fintech",
});
connection.connect();

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

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/main", function (req, res) {
  res.render("main");
});

//app.get("/authText", auth, function (req, res) {
  //res.json("당신은 콘텐츠 접근에 성공했습니다.");
//});

app.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  console.log(authCode);

  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    form: {
      code: authCode,
      client_id: "sqyQCZIPoiM37quLRERrPo3oQWZLZqPnc8qMmXKp",
      client_secret: "EIBHTpbo61wLEjHOHrfjx60ImrdzwC5AS2oIyMZa",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code",
      //#자기 키로 시크릿 변경
    },
  };

  request(option, function (error, response, body) {
    var accessRequestResult = JSON.parse(body); //JSON 오브젝트를 JS 오브젝트로 변경
    console.log(accessRequestResult);
    res.render("resultChild", { data: accessRequestResult });
  });
});

app.post("/signup", function (req, res) {
  var userName = req.body.userName;
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var userAccessToken = req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;
  console.log(userName, userEmail, userPassword);
  connection.query(
    "INSERT INTO `user`(`name`,`email`,`password`,`accesstoken`,`refreshtoken`,`userseqno`)VALUES(?,?,?,?,?,?);",
    [
      userName,
      userEmail,
      userPassword,
      userAccessToken,
      userRefreshToken,
      userSeqNo,
    ],
    function (error, results, fields) {
      if (error) throw error;
      else {
        res.json(1);
      }
    }
  );
});

app.post("/login", function (req, res) {
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  console.log(userEmail, userPassword);
  connection.query("SELECT * FROM user WHERE email = ?", [userEmail], function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    else {
      if (results.length == 0) {
        res.json(2); // 아이디 존재하지 않음
      } else {
        var storedPassword = results[0].password;
        if (storedPassword == userPassword) {
          jwt.sign(
            {
              userId: results[0].id,
              userEmail: results[0].email,
            },
            tokenKey,
            {
              expiresIn: "5d",
              issuer: "fintech.admin",
              subject: "user.login.info",
            },
            function (err, token) {
              console.log("로그인 성공", token);
              res.json(token);
            }
          );
        } else {
          res.json("로그인 실패");
        }
      }
    }
  });
});

app.post("/list", auth, function (req, res) {
  //https://testapi.openbanking.or.kr/v2.0/user/me url 에 Request 요청하기
  var option = {
    method: "GET",
    url: "https://testapi.openbanking.or.kr/v2.0/user/me",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiIxMTAwNzYzNDY4Iiwic2NvcGUiOlsiaW5xdWlyeSIsImxvZ2luIiwidHJhbnNmZXIiXSwiaXNzIjoiaHR0cHM6Ly93d3cub3BlbmJhbmtpbmcub3Iua3IiLCJleHAiOjE2MTYzMzg4MzQsImp0aSI6IjVkMzEwYWYyLTk0N2ItNGQyYS1iY2VlLTE0OTI3MDRjY2E1ZiJ9.XctYXoQnRYCIIoZ8UVtywLqUOqySYOch8g8c_Heqa2Q",
    },
    //accesstoken 입력
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    qs: {
      user_seq_no: "1100763468",
      //#자기 키로 시크릿 변경
    },
  };

  request(option, function (err, response, body) {
    var resResult = JSON.parse(body);
    //json 문서를 파싱하여 javascript 오브젝트로 변환
    res.json(resResult);
  });
});

app.listen(3000);
