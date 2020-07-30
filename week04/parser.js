let currentToken = null
let currentAttribute = null
let currentTextNode = null

let stack = [{type: 'document',children:[]}]
function emit(token){
    // console.log(token)
    let top = stack[stack.length-1]
    if(token.type == "startTag"){
        let element = {
            type: 'element',
            children:[],
            attributes:[]
        }
        element.tagName = token.tagName
        for(let p in token){
            if(p != "type" && p != "tagName"){
                element.attributes.push({
                    name:p,
                    value:token[p]
                })
            }
        }
        // 建立父子关系
        top.children.push(element)
        element.parent = top

        if(!token.isSelfClosing){
            stack.push(element)
        }
        currentTextNode = null
    }else if(token.type == "endTag"){
        if(top.tagName != token.tagName){
            throw new error("Tag start end doesn't match!")
        }else{
            stack.pop()
        }
        currentTextNode = null
    }else if(token.type == "text"){
        if(currentTextNode == null){
            currentTextNode = {
                type: "text",
                content:""
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

// 利用Symbol的唯一性，作为symbol的一个状态，强制结束状态机
const EOF = Symbol("EOF")   // EOF:end of file

function data(c){
    if(c == "<"){
        return tagOpen
    }else if(c == EOF){
        emit({
            type:"EOF"
        })
        return 
    }else{
        emit({
            type:"text",
            content:c
        })
        return data
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    }else{
        return
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    }else if(c == ">"){

    }else if(c == EOF){
        
    }else{

    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
    }else if(c == "/"){
        return selfClosingStartTag
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c //c.toLowerCase()
        return tagName
    }else if(c == ">"){
        emit(currentToken)
        return data
    }else{
        return tagName
    }
}

// <body style=""></body>
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
    }else if(c == ">" || c == "/" || c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        
    }else{
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == ">" || c == "/" || c == EOF){
        return afterAttributeName(c)
    }else if(c == "="){
        return beforeAttributeValue
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<"){

    }else{
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c == ">" || c == "/" || c == EOF){
        return beforeAttributeValue
    }else if(c == "\""){
        return doubleQuotedAttributeValue
    }else if(c == "\'"){
        return singleQuotedAttributeValue
    }else if(c == ">"){

    }else{
       return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c){
   if(c == "\""){
       currentToken[currentAttribute.name] = currentAttribute.value
       return afterQuotedAttributeValue
    }else if(c == "\u0000"){
        
    }else if(c == EOF){

    }else{
        currentAttribute.value += c
       return doubleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName
     }else if(c == "/"){
         return selfClosingStartTag
     }else if(c == ">"){
         currentToken[currentAttribute.name] = currentAttribute.value
         emit(currentToken)
         return data
     }else if(c == EOF){
 
     }else{
         currentAttribute.value += c
        return doubleQuotedAttributeValue
     }
}

function singleQuotedAttributeValue(c){
   if(c == "\""){
       currentToken[currentAttribute.name] = currentAttribute.value
       return afterQuotedAttributeValue
    }else if(c == "\u0000"){
        
    }else if(c == EOF){

    }else{
        currentAttribute.value += c
        // ???
       return singleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
       currentToken[currentAttribute.name] = currentAttribute.value
       return beforeAttributeName
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`"){

    }else if(c == EOF){

    }else{
        currentAttribute.value += c
       return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c){
    if( c == ">"){
        currentToken.isSelfClosing = true
        return data
    }else if(c == "EOF"){

    }else{
        
    }

}

module.exports.parseHTML = function parseHTML(html){
    let state = data
    for(let c of html){
        state = state(c)
    }
    state = state(EOF)
    console.log(stack[0])
    return stack[0]
}
