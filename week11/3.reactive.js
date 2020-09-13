
let callbacks = [];

let object = {
    a: 1,
    b: 2
}

let po = reactive(object);

effect(()=>{
    console.log(111,po.a)
})

// effect传一个函数进去，监听po上面的属性，以此来代替事件监听机制
function effect(callback){
    callbacks.push(callback)
}

function reactive(object) {
     return new Proxy(object, {
        set(obj, prop, val) {
            obj[prop] = val;
            for(let callback of callbacks){
                callback()
            }
            return obj[prop]
        },
        get(obj, prop) {
            console.log(obj,prop)
            return obj[prop]
        }
    })
}

po.a = 33