let callbacks = new Map();
// 每个对象调用reactive时，加个缓存
let reactivities = new Map();

let usedReactivities = [];

let object = {
    a : { b: 1},
    b : 2
}

let po = reactive(object);

effect(()=>{
    console.log(111,po.a.b)
})

// effect传一个函数进去，监听po上面的属性，以此来代替事件监听机制
function effect(callback){
    // callbacks.push(callback)
    
    usedReactivities=[];
    // 调用callback，如果callback里面引到了po对象，在reactive的get里一定会发生注册行为
    callback();
    console.log(333,usedReactivities)

    for(let reactivity of usedReactivities){
        if(!callbacks.has(reactivity[0])){
            callbacks.set(reactivity[0],new Map());
        }
        if(!callbacks.get(reactivity[0]).has(reactivity[1])){
            callbacks.get(reactivity[0]).set(reactivity[1],[]);
        }
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }
}

function reactive(object){
    // 缓存
    if(reactivities.has(object)){
        return reactivities.get(object);
    }

    let proxy = new Proxy(object,{
        set(obj,prop,val){
            obj[prop] = val

            if(callbacks.get(obj)){
                if(callbacks.get(obj).get(prop)){
                    for(let callback of callbacks.get(obj).get(prop)){
                        callback()
                    }
                };
                return obj[prop]
            }
        },
        get(obj,prop){
            // 在get里面监听用了哪些变量
            usedReactivities.push([obj,prop]);
            if(typeof obj[prop] === "object"){
                return reactive(obj[prop])
            }
            return obj[prop]
        }
    })

    reactivities.set(object,proxy);
    return proxy;
}

po.a.b= 44