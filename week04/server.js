const http = require('http');
http.createServer((request, response) => {
  let body = []
  request.on('error',(error)=>{
    console.log('error:',error)
  }).on('data', (chunk) => {
    console.log('data:',chunk.toString())
    body.push(chunk)
  }).on('end',() => {
    body = body.join('')
    console.log("body:",body)
    response.writeHead(200,{ 'Content-type': 'text/html' })
    // response.end("hello world\n")
    response.end(
    `<html>
<head>
    <title>这是个标题</title>
    <style>
      #title{
        color :red;
      }
    </style>
</head>
<body>
    <h1 id="title">这是一个一个简单的HTML</h1>
    <p>Hello World！</p>
</body>
</html>`
    )
  })
  
}).listen(8082);

console.log("server start")

