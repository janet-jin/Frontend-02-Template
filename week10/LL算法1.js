
// +至少一个  \t制表符
var reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ["Number","WhiteSpace","LineTerminator","*","/","+","-"];

function tokenize(source){
  var result = null;
  while(true){
    result = reg.exec(source);
    if(!result) break;

    for(var i = 1; i <= dictionary.length; i++){
      if(result[i]){
        console.log(111,dictionary[i-1])
      }
    }
    console.log(222,result);
  }
}

tokenize("1024 + 10 * 25")
