let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown",event =>{

    let context = Object.create(null);
    // button属性区分是哪个键按下的
    // event.button 0-左键，2--右键，1--滚轮
    contexts.set("mouse" + event.button,context)
    start(event, context);

    let mousemove = event =>{
        // mousemove中，没有button属性，因为不需要按左右键就可以move
        // 但有的是buttons属性，表示哪些键被按下
        // event.buttons 1--左键  2--右键，4--滚轮
        // buttons 里面滚轮跟右键的顺序跟button的值不一样，处理一下
        let context;
        if(event.buttons == 1){
            // 左键
            context = contexts.get("mouse" + 0);
            move(event, context);
        }else if(event.buttons == 2){
            // 右键
            context = contexts.get("mouse" + 2);
            move(event, context);
        }else if(event.buttons == 4){
            // 中键
            context = contexts.get("mouse" + 1);
            move(event, context);
        }else if(event.buttons == 3){
            // 左键+右键
            context = contexts.get("mouse" + 0);
            move(event, context);
            context = contexts.get("mouse" + 2);
            move(event, context);
        }else if(event.buttons == 5){
            // 左+中
            context = contexts.get("mouse" + 0);
            move(event, context);
            context = contexts.get("mouse" + 1);
            move(event, context);
        }else if(event.buttons == 6){
            // 右+中
            context = contexts.get("mouse" + 2);
            move(event, context);
            context = contexts.get("mouse" + 1);
            move(event, context);
        }else if(event.buttons == 7){
            // 左键+中+右
            context = contexts.get("mouse" + 0);
            move(event, context);
            context = contexts.get("mouse" + 2);
            move(event, context);
            context = contexts.get("mouse" + 1);
            move(event, context);
        }
    }

    let mouseup = event =>{
      
        let context = contexts.get("mouse" + event.button);
        end(event, context)
        contexts.delete("mouse" + event.button);

        // 如果没有任何键按下，清除事件console.log(event)
        if(event.buttons === 0){
            document.removeEventListener("mousemove",mousemove);
            document.removeEventListener("mouseup",mouseup);
            isListeningMouse = false;
        }
    }

    if(!isListeningMouse){
        document.addEventListener("mousemove",mousemove);
        document.addEventListener("mouseup",mouseup);
        isListeningMouse = true;
    }
})

let contexts = new Map();

element.addEventListener("touchstart",event =>{
    for(let touch of event.changedTouches){
        let context = Object.create(null);
        contexts.set(touch.identifier,context)
       start(touch,context);
    }
   
})
element.addEventListener("touchmove",event =>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        move(touch,context);
    }
})
element.addEventListener("touchend",event =>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        end(touch,context)
        contexts.delete(touch.identifier)
    }
   
})
// 系统事件会打断touch，比如说alert，这时候就会触发cancel事件
element.addEventListener("touchcancel",event =>{
    for(let touch of event.changedTouches){
        let context = contexts.get(touch.identifier)
        cancel(touch,context)
        contexts.delete(touch.identifier)
    }
   
})

// let handler;
// let startX,startY;
// let isPan = false,isTap = false,isPress = false;

let start = (point,context) => {
    // console.log("start",point.clientX,point.clientY)
    context.startX = point.clientX;
    context.startY = point.clientY;

    context.points = [{
        t: Date.now(),
        x: point.clientY,
        y: point.clientY
    }]

    context.isPan = false;
    context.isTap = true;
    context.isPress = false;
    // touch超过0.5秒，press为true
    context.handler = setTimeout(() => {
        context.isPan = false;
        context.isTap = false;
        context.isPress = true;
        context.handle = null;
        console.log("press")
    },500)
}

let move = (point,context) => {
    // console.log("move",point.clientX,point.clientY)
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if(!context.isPan && dx ** 2 + dy ** 2 > 100){
        context.isPan = true;
        context.isTap = false;
        context.isPress = false;
        console.log("panStart")
        clearTimeout(context.handler)
    }

    if(context.isPan){
        console.log(dx,dy)
        console.log("pan")
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
        t: Date.now(),
        x: point.clientY,
        y: point.clientY
    })
}

let end = (point,context) => {
    if(context.isTap){
        console.log("tap")
        clearTimeout(context.handler)
    }
    if(context.isPan){
        console.log("panend")
    }
    if(context.isPress){
        console.log("pressend")
    }
    context.points = context.points.filter(point => Date.now() - point.t < 500)
    let d, v;
    if(!context.points.length){
        v = 0;
    }else{
        d = Math.sqrt(((point.clientX -  context.points[0].x) ** 2 + (point.clientY -  context.points[0].y)));
        v = d / (Date.now() - context.points[0].t)
    }
    // 速度的单位是 像素每毫秒
    if(v > 1.5){
        console.log("flick")
        context.isFlick = true;
        dispatch("flick",{});
    }else{
        context.isFlick = false;
    }
    // console.log("end",point.clientX,point.clientY)

}

let cancel = (point,context) => {
    clearTimeout(context.handler)
    console.log("cancel",point.clientX,point.clientY)

}

function dispatch(type,properties){
    let event = new Event(type);
    // console.log(event)
    for(let name in properties){
        // for in 遍历对象的键名、遍历数组可以使用但是不推荐
        event[name] = properties[name];
    }
    element.dispatchEvent(event);
}

//  listen => recognize => dispatch

