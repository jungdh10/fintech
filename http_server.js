var http = require("http");

http
.createServer(function (req, res) {
	var body = "<html><h1>test</h1></html>";
	console.log("요청이 들어왔습니다.");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.end(body);
})
.listen(3000);

//127.0.0.1:3000 < nodejs http server
//127.0.0.1:3306 < mysql