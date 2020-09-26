import {Component,createElement} from "./framework.js"
import {Carousel} from "./carousel.js"
import {Timeline,Animation} from "./animation.js"

let d = [
    "./assets/img/1.png",
    "./assets/img/2.png",
    "./assets/img/3.png",
    "./assets/img/4.png"
]

let  a = <Carousel src={d} />

a.mountTo(document.body)

let tl = new Timeline()
window.tl = tl;
window.animation = new Animation({set a (v) { console.log(v)}},"a",0,100,1000,null);
// tl.add(new Animation({set a (v) { console.log(v)}},"a",0,100,1000,null))
tl.start()