import {Component} from "./framework.js"

export class Carousel extends Component{
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

        let position = 0;

        this.root.addEventListener("mousedown",event=>{
            console.log("mousedown")
            let children = this.root.children;
            let startX = event.clientX;
            let move = event =>{
                console.log("mousemove")
                let x = event.clientX - startX;

                let current = position - ((x - x % 500) / 500);

                for(let offset of [-1,0,1]){
                    let pos = current + offset;
                    // 用取余运算来处理，不出现负数：加上取余的这个数再除以取余的这个数，就不会出现负数
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translateX(${- pos*500 + offset * 500 + x % 500}px)`
                }

            }
            let up = event =>{
                // 向右查看是从右向左拖动，event.clientX - startX为负值，向左查看为正值
                // 所以要用原来的索引减去这个值（四舍五入后0个位置或者负1个位置）
                let x = event.clientX - startX;
                position = position - Math.round(x/500);
                for(let offset of [0,- Math.sign(Math.round(x / 500)- x + 250 * Math.sign(x))]){
                    let pos = position + offset;
                    // 用取余运算来处理，不出现负数：加上取余的这个数再除以取余的这个数，就不会出现负数
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translateX(${- pos*500 + offset * 500 }px)`
                }
                console.log("mouseup")
                document.removeEventListener("mousemove",move);
                document.removeEventListener("mouseup",up);
            }
            document.addEventListener("mousemove",move)
            document.addEventListener("mouseup",up)
        })
        return this.root;
    }
    mountTo(parent){
        //保证render()在获取数据之后
        parent.appendChild(this.render());
    }
}
