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
    <style>
    #container{
      color :red;
      width:500px;
      height:300px;
      display:flex;
      background-color:rgb(216,191,216);
    }
    #container #myId{
      width:200px;
      height:100px;
      background-color:rgb(210,105,30);
    }
    #container .c1{
      flex:1;
      background-color:rgb(0,128,128);
    }
  </style>
</head>
<body>
<div id="container">
<div id="myId"></div>
<div class="c1"></div>
</div>
</body>
</html>`
    )
  })
  
}).listen(8082);

console.log("server start")
