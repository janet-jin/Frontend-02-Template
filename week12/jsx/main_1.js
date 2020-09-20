function createElement(type,attributes,...children){
    let element;
    if(typeof type==="string"){
        element = document.createElement(type);
    }else{
        element = new type;
    }
    for(let name in attributes){
        element.setAttribute(name,attributes[name])
    }
    for(let child of children){
        if(typeof child === "string"){
            // 处理文本节点
            child = document.createTextNode(child);
        }
        element.appendChild(child)
    }
    return element;
}

    // 需要标签都是小写 
let  a = <div id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
</div>
document.body.appendChild(a)
