export function createElement(type,attributes,...children){
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
// 公共部分
export class Component{
    constructor(type) {
        // this.root = this.render();
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
// 解析标签
class ElementWrapper extends Component{
    constructor(type) {
        this.root = document.createElement(type)
    }
}
// 解析文本节点
class TextWrapper extends Component{
    constructor(content) {
        this.root = document.createTextNode(content)
    }
}

