
// +至少一个  \t制表符
var reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ["Number","WhiteSpace","LineTerminator","*","/","+","-"];

function* tokenize(source){
  var result = null;
  var lastIndex = 0;
  while(true){
    result = reg.exec(source);
    // lastIndex,下次匹配的起始位置
    lastIndex = reg.lastIndex;
    if(!result) break;
    // 长度超过说明有不认识的字符，出现了错误
    if(reg.lastIndex - lastIndex > result[0].length){
      break;
    }

    let token = {
      type:null,
      value:null
    }

    for(var i = 1; i <= dictionary.length; i++){
      if(result[i]){
        token.type = dictionary[i-1]
      }
    }
    token.value = result[0]
    yield token
  }
  yield {
    type:"EOF"
  }
}

for(let token of tokenize("1024 + 10 * 25")){
  console.log(token)
}

