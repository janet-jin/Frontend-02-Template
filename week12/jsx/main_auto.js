import {Component,createElement} from "./framework.js"

class Carousel extends Component{
    constructor() {
        super()
        this.attributes = Object.create(null);
    }
    setAttribute(name,value){
        this.attributes[name] = value;
    }
    render(){
        this.root = document.createElement("div");  
        this.root.classList.add("carousel")
        for(let record of this.attributes.src){
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }
        let currentIndex = 0
        setInterval(() => {
            let children = this.root.children;
            // 取余，current的长度永远不会超过4
           let nextIndex = (currentIndex +1) % children.length;

           let current = children[currentIndex];
           let next = children[nextIndex];

            next.style.transition = "none";
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`

            setTimeout(() => {
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
                next.style.transform = `translateX(${- nextIndex * 100}%)`

                currentIndex = nextIndex;
            }, 16);
           
        }, 2000);
        return this.root;
    }
    mountTo(parent){
        //保证render()在获取数据之后
        parent.appendChild(this.render());
    }
}

let d = [
    "./assets/img/1.png",
    "./assets/img/2.png",
    "./assets/img/3.png",
    "./assets/img/4.png"
]

let  a = <Carousel src={d} />

a.mountTo(document.body)