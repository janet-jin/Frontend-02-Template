const net = require('net')
const images = require('images')
const parser = require("./parser.js")
const render = require("./render.js")
// 注释掉 on end里面的body赋值，或者on data里面的chunk.toString()给为chunk,不然会400 bad request
class Request {
  constructor(options){
    this.method = options.method || "GET"
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
   if(!this.headers["Content-type"]){
    this.headers["Content-type"] = 'application/x-www-form-urlencoded'
   }
   if(this.headers["Content-type"] === 'application/json'){
     this.bodyText = JSON.stringify(this.body)
   }else if(this.headers["Content-type"] === 'application/x-www-form-urlencoded'){
    this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
   }
   this.headers['Content-length'] = this.bodyText.length;

  }
  send(connection){
    return new Promise((resolve,reject) => {
      const parser = new ResponseParser()
      if(connection){
        connection.write(this.toString())
      }else{
        connection= net.createConnection({
          host:this.host,
          port:this.port
        },()=>{
          connection.write(this.toString())
        })
      }
      connection.on("data",(data)=>{
        // console.log(data.toString())
        parser.receive(data.toString())
        if(parser.isFinished){
          // console.log('isFinished')
          resolve(parser.response)
          connection.end()
        }
      })
      connection.on("error",(err)=>{
        reject(err)
        connection.end()
      })
    })
  }

  toString(){
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key=>`${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }

}

class ResponseParser {
  constructor(){
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.HeaderValue = "";
    this.bodyParser = null;
  }
  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished
  }
  get response(){
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this. bodyParser.content.join('')
    }
  }

  receive(string){
    console.log(string)
    // 'HTTP/1.1 200 OK\r\nContent-type: text/html\r\nDate: Sun, 26 Jul 2020 03:12:13 GMT\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n\r\nc\r\nhello world\n\r\n0\r\n\r\n'

    for (let i=0;i<string.length;i++){
      // console.log("-----------------------"+i)
      this.receiveChar(string.charAt(i))
    }
  }
  receiveChar(char){
    // console.log("char="+char)
    // console.log("current="+ this.current)
    // console.log("statusLine="+ this.statusLine)
    // console.log("headers:"+ this.headers)
    // console.log("bodyParser:"+ this.bodyParser)

    if(this.current === this.WAITING_STATUS_LINE){
      if(char === '\r'){
        this.current = this.WAITING_STATUS_LINE_END
      }else{
        this.statusLine += char
      }
    }else if(this.current === this.WAITING_STATUS_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME
      }
    }else if(this.current === this.WAITING_HEADER_NAME){
      if(char === ':'){
        this.current = this.WAITING_HEADER_SPACE
      }else if(char === '\r'){
        this.current = this.WAITING_HEADER_BLOCK_END
        if(this.headers['Transfer-Encoding'] === 'chunked'){
          this.bodyParser = new TrunkedBodyParser()
        }
      }else{
        this.headerName += char
      }
    }else if(this.current === this.WAITING_HEADER_SPACE){
      if(char === ' '){
        this.current = this.WAITING_HEADER_VALUE
      }
    }else if(this.current === this.WAITING_HEADER_VALUE){
      if(char === '\r'){
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.HeaderValue
        this.headerName = ""
        this.HeaderValue = ""
      }else{
        this.HeaderValue += char
      }
    }else if(this.current === this.WAITING_HEADER_LINE_END){
      if(char === '\n'){
        this.current = this.WAITING_HEADER_NAME
      }
    }else if(this.current === this.WAITING_HEADER_BLOCK_END){
      if(char === '\n'){
        this.current = this.WAITING_BODY
      }
    }else if(this.current === this.WAITING_BODY){
    //  console.log(char,this.headers)
     this.bodyParser.receiveChar(char)
    }
  }
}
class TrunkedBodyParser {
  constructor(){
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.currentNum = this.WAITING_LENGTH
  }
  receiveChar(char){
    if(this.currentNum === this.WAITING_LENGTH){
      if(char === '\r'){
        if(this.length === 0){
          this.isFinished = true
        }
        this.currentNum = this.WAITING_LENGTH_LINE_END
      }else{
        this.length *= 16
        this.length += parseInt(char,16)
      }
    }else if(this.currentNum === this.WAITING_LENGTH_LINE_END){
      if(char === '\n'){
        this.currentNum = this.READING_TRUNK
      }
    }else if(this.currentNum === this.READING_TRUNK){
      this.content.push(char)
      this.length --
      if(this.length === 0){
        this.currentNum = this.WAITING_NEW_LINE
      }
    }else if(this.currentNum === this.WAITING_NEW_LINE){
      if(char === '\r'){
        this.currentNum = this.WAITING_NEW_LINE_END
      }
    }else if(this.currentNum === this.WAITING_NEW_LINE_END){
      if(char === '\n'){
        this.currentNum = this.WAITING_LENGTH
      }
    }
  }
}

void async function (){
  var request = new Request({
    method: "POST",
    host:'127.0.0.1',
    port:'8082',
    path:'/',
    headers:{
      ["X-Foo2"]:"customed"
    },
    body:{
      name:"jlx"     
    }
  });
  let response = await request.send()
  console.log(response.body)
  let dom = parser.parseHTML(response.body)
  let viewport = images(800,600)
  render(viewport,dom.children[0].children[3].children[1])
  console.log()
  viewport.save("viewport.jpg")


}();console.log()