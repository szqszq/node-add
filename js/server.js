/*引入http模块*/
var http = require("http");
/*引入fs模块*/
var fs = require("fs");
/*引入url模块*/
var url = require("url");
/*引入json路径*/
var file = "01.json";
/*开启服务*/
http.createServer(function(req, res) {
	/*写入信息头*/
	res.writeHead(200, { "content-type": "text/html;charset=utf-8", "Access-Control-Allow-Origin": "*" });
	/*获取添加页的输入内容*/
	var info = url.parse(req.url, true).query;
	// console.log(info);
	/*获取"/"与"？"之间的内容包括"/"不包括"?"*/
	var pathname = url.parse(req.url).pathname;
	// console.log("pathname:",pathname);
	/*判断路径*/
	if(pathname == "/" || pathname == "/favicon.ico") {
		res.write("这是主页<br/><br/>");
		res.write("你想去前台页面看看嘛?");
		res.end();
	} else if(pathname == "/add") {
		/*读取json*/
		fs.readFile(file, function(err, data) {
			if(err) {
				console.log("读取失败", err);
			} else {
				/*将json里的数据转化为数组*/
				var arr = JSON.parse(data.toString());
				/*给输入内容添加id*/
				info.id = (new Date().getTime()) + "";
				/*将输入内容添加到arr中*/
				arr.unshift(info);
				fs.writeFile(file, JSON.stringify(arr), function(err) {
					if(err) {
						console.log("写入失败", err);
					} else {
						/*给前端返回json的数据*/
						res.end(JSON.stringify(arr));
					}
				})
			}
		})
		/*刷新页面执行获取*/
	} else if(pathname == "/get") {
		/*读取json*/
		fs.readFile(file, function(err, data) {
			if(err) {
				console.log("读取失败");
			} else {
				/*将json里的数据转化为数组*/
				var arr = JSON.parse(data.toString());
				/*给前端返回json的数据*/
				res.end(JSON.stringify(arr));
			}
		})
		/*删除时执行*/
	} else if(pathname == "/del") {
		/*读取json*/
		fs.readFile(file, function(err, data) {
			if(err) {
				console.log("读取失败");
			} else {
				/*将json里的数据转化为数组*/
				var arr = JSON.parse(data.toString());
				/*遍历json数据*/
				for(var i in arr) {
					/*判断与传入删除用的id是否相等*/
					if(info.id == arr[i].id) {
						arr.splice(i, 1);
						break;
					}
				}
				/*删除后将新的数据写入json中*/
				fs.writeFile(file, JSON.stringify(arr), function(err) {
					if(err) {
						console.log("写入失败");
					} else {
						/*给前端返回json的数据*/
						res.end(JSON.stringify(arr));
					}
				})
			}
		})
	} else if(pathname == "/pt") {
		/*读取json*/
		fs.readFile(file, function(err, data) {
			if(err) {
				console.log("读取失败");
			} else {
				/*将json里的数据转化为数组*/
				var arr = JSON.parse(data.toString());
				/*遍历json数据*/
				for(var i in arr) {
					/*判断与传入删除用的id是否相等*/
					if(info.id == arr[i].id) {
						res.end(JSON.stringify(arr[i]));
						break;
					}
				}
			}
		})
	} else if(pathname == "/p") {
		/*读取json*/
		fs.readFile(file, function(err, data) {
			if(err) {
				console.log("读取失败");
			} else {
				/*将json里的数据转化为数组*/
				var arr = JSON.parse(data.toString());
				/*遍历json数据*/
				for(var i in arr) {
					/*判断与传入删除用的id是否相等*/
					if(info.id == arr[i].id) {
						arr[i].name = info.name;
						arr[i].age = info.age;
						arr[i].sex = info.sex;
						arr[i].hobby = info.hobby;
						break
					}
				}
				fs.writeFile(file, JSON.stringify(arr), function(err) {
					if(err) {
						console.log("修改失败");
					} else {
						res.end(JSON.stringify(arr));
					}
				})
			}
		})
	}else{
		res.writeHead(404, {"content-type": "text/html;charset=utf-8"});
		res.write("<a href='index'>主页</a>")
		res.end("页面不存在");
	}

}).listen(81, function() {
	console.log("开启服务");
})