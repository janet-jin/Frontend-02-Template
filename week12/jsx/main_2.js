function createElement(type,attributes,...children){
    let element;
    if(typeof type==="string"){
        element = new ElementWrapper(type);
    }else{
        element = new type;
    }
    for(let name in attributes){
        element.setAttribute(name,attributes[name])
    }
    for(let child of children){
        if(typeof child === "string"){
            // 处理文本节点
            child = new TextWrapper(child);
        }
        element.appendChild(child)
    }
    return element;
}

class ElementWrapper{
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name,value){
        this.root.setAttribute(name,value)
    }
    appendChild(child){
        child.mountTo(this.root)
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}
class TextWrapper{
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    setAttribute(name,value){
        this.root.setAttribute(name,value)
    }
    appendChild(child){
        child.mountTo(this.root)
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

class Carousel{
    constructor() {
        this.root = document.createElement("div")
    }
    setAttribute(name,value){
        this.root.setAttribute(name,value)
    }
    appendChild(child){
        child.mountTo(this.root)
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }

}

let  a = <Carousel id="a">
    <span>a</span>
    <span>b</span>
    <span>c</span>
    <span>d</span>
</Carousel>

a.mountTo(document.body)