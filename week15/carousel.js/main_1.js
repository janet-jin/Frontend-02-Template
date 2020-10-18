import {Component,createElement} from "./framework.js"
import {Carousel} from "./Carousel.js"
import {Timeline,Animation} from "./animation.js"

let d = [
    {
        img: "./assets/img/1.png",
        url: "https://www.baidu.com"
    },
    {
        img: "./assets/img/2.png",
        url: "https://www.baidu.com"
    },
    {
        img: "./assets/img/3.png",
        url: "https://www.baidu.com"
    },
    {
        img: "./assets/img/4.png",
        url: "https://www.baidu.com"
    }    
]

let  a = <Carousel src={d} 
    onChange={event => console.log(event.detail.position)}
    onClick={event => window.location.href = event.detail.data.url}/>

a.mountTo(document.body)

// let tl = new Timeline()
// window.tl = tl;
// window.animation = new Animation({set a (v) { console.log(v)}},"a",0,100,1000,null);
// tl.start()