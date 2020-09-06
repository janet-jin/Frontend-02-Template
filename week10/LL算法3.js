
// +至少一个  \t制表符
var reg = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ["Number", "whiteSpace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
  var result = null;
  var lastIndex = 0;
  while (true) {
    result = reg.exec(source);
    // lastIndex,下次匹配的起始位置
    lastIndex = reg.lastIndex;
    if (!result) break;
    if (reg.lastIndex - lastIndex > result[0].length) {
      break;
    }

    let token = {
      type: null,
      value: null
    }

    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i]) {
        token.type = dictionary[i - 1]
      }
    }
    token.value = result[0]
    yield token
  }
  yield {
    type: "EOF"
  }
}

let source = [];
for (let token of tokenize("1024 + 10 * 25")) {
  if (token.type !== "whiteSpace" && token.type !== "LineTerminator") {
    source.push(token)
    console.log(token)
  }
}

function Expression(source) {
  if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF") {
    let node = {
      type: "Expression",
      children: [source.shift(), source.shift()]
    }
    source.unshift(node);
    return node;
  }
  AdditiveExpression(source);
  return Expression(source);
}

function AdditiveExpression(source) {
  // <Multip>情况
  if (source[0].type === "MultiplicativeExpression") {
    let node = {
      type: "AdditiveExpression",
      children: [source[0]]
    }
    source[0] = node;
    return AdditiveExpression(source);
  }
  //<Addit> + <Multip>情况
  if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "+") {
    let node = {
      type: "AdditiveExpression",
      operator: "+",
      children: []
    }

    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source);
  }
  //<Addit> - <Multip>情况
  if (source[0].type === "AdditiveExpression" && source[1] && source[1].type === "-") {
    let node = {
      type: "AdditiveExpression",
      operator: "-",
      children: []
    }

    node.children.push(source.shift())
    node.children.push(source.shift())
    MultiplicativeExpression(source)
    node.children.push(source.shift())
    source.unshift(node)
    return AdditiveExpression(source);
  }
  if (source[0].type === "AdditiveExpression") {
    return source[0]
  }
  // 如果刚进来是<Number>执行下面
  MultiplicativeExpression(source);
  return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
  // <number>情况
  if (source[0].type === "Number") {
    let node = {
      type: "MultiplicativeExpression",
      children: [source[0]]
    }
    source[0] = node;
    return MultiplicativeExpression(source);
  }
  //<Multi> * <number>情况
  if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "*") {
    let node = {
      type: "MultiplicativeExpression",
      operator: "*",
      children: []
    }

    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source);
  }
  //<Multi> / <number>情况
  if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "/") {
    let node = {
      type: "MultiplicativeExpression",
      operator: "/",
      children: []
    }

    node.children.push(source.shift())
    node.children.push(source.shift())
    node.children.push(source.shift())
    source.unshift(node)
    return MultiplicativeExpression(source);
  }
  if (source[0].type === "MultiplicativeExpression") {
    return source[0]
  }
  return MultiplicativeExpression(source);
}

Expression(source)
console.log(source)

// 打印出来的结构
sourceJson = [
  {
    type: "Expression",
    children: [
      {
      type: "AdditiveExpression",
      operator: "+",
      children: [
        {
        type: "AdditiveExpression",
        children: [
          {
          type: "MultiplicativeExpression",
          children: [
            {
            type: "Number",
            value: "1024"
            }
           ]
          }
      ]
      }, 
      {
        type: "+",
        value: "+"
      }, 
      {
        type: "MultiplicativeExpression",
        operator: "*",
        children: [
          {
          type: "MultiplicativeExpression",
          children: [
            {
            type: "Number",
            value: "10"
           }
          ]
          }, 
          {
            type: "*",
            value: "*"
          }, 
          {
            type: "Number",
            value: "25"
          }
        ]
      }
    ]
    }, 
    {
      type: "EOF"
    }
  ]
  }
]
