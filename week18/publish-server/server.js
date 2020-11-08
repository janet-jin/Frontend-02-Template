const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');

// 2.auth 路由：接收code，用code + client_id + client_secret 换 token
// 4.publish路由：用token获取用户信息，检查权限，接受发布
//Client secrets:f8fd037480d92e26e7d7b775fd04de846512d4fc

function auth(request, response) {
  const query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  getToken(query.code, (info) => {
    console.log(info, "info")
      // response.write(JSON.stringify(info));
    response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`)
    response.end();
  });
}

// 4. publish路由：用token获取用户信息，检查权限，接受发布
function publish(request, response) {
  const query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);

  getUser(query.token, info => {
    if (info.login === 'janetjin') {
      request.pipe(unzipper.Extract({
        path: '../server/public'
      }));
      request.on('end', () => {
        response.end("Success!")
      })
    }
  })
}

function getUser(token, callback) {
  const request = https.request({
    hostname: 'api.github.com',
    path: `/user`,
    port: 443,
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": 'toy-publish-qiyue'
    }
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      console.log(chunk.toString());
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(JSON.parse(body));
    })
  });

  request.end();
}

function getToken(code, callback) {
  const request = https.request({
    hostname: 'github.com',
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.40e5667c968dc616&client_secret=f8fd037480d92e26e7d7b775fd04de846512d4fc`,
    port: 443,
    method: "POST",
  }, function(response) {
    let body = "";
    response.on('data', chunk => {
      console.log(chunk.toString());
      body += (chunk.toString());
    })
    response.on('end', () => {
      callback(querystring.parse(body));
    })
  });
  request.end();
}


http.createServer(function(request, response) {
  if (request.url.match(/^\/auth\?/)) {
    return auth(request, response);
  }
  if (request.url.match(/^\/publish\?/)) {
    return publish(request, response);
  }

}).listen(8082);