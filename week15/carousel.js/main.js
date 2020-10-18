import {Component,createElement} from "./framework.js"
import {Carousel} from "./Carousel.js"
import {Button} from "./Button.js"
import {List} from "./List.js"

let d = [
    {
        img: "./assets/img/1.png",
        url: "https://www.baidu.com",
        title:"树11"
    },
    {
        img: "./assets/img/2.png",
        url: "https://www.baidu.com",
        title:"树12"
    },
    {
        img: "./assets/img/3.png",
        url: "https://www.baidu.com",
        title:"树13"
    },
    {
        img: "./assets/img/4.png",
        url: "https://www.baidu.com",
        title:"树14"
    }    
]

/*
let  a = <Carousel src={d} 
    onChange={event => console.log(event.detail.position)}
    onClick={event => window.location.href = event.detail.data.url}/> */

let a = <List data={d}>
    {(record) =>
        <div>
            <img src={record.img} />
            <a href={record.url}>{record.title}</a>
        </div>
    }
</List>

a.mountTo(document.body)

