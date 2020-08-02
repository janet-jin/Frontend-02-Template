function getStyle(element){
    if(!element.style){
        element.style = {}
    }
    for(let prop in element.computedStyle){
        var p = element.computedStyle.value
        element.style[prop] = element.computedStyle[prop].value

        //转化成数字
        if(element.style[prop].toString().match(/px$/)){
            element.style[prop] = parseInt(element.style[prop])
        }
        if(element.style[prop].toString().match(/^[0-9\.]+$/)){
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style
}

function layout(element){
    if(!element.computedStyle){
        return
    }
    var elementStyle = getStyle(element)
    if(elementStyle.display !== "flex"){
        return
    }
    // 过滤文本节点
    var items = element.children.filter(e => e.type === "element")
    // sort升序排列 为了支持order
    items.sort(function(a,b){
        return (a.order || 0) - (b.order || 0)
    })
    var style = elementStyle;
    // 把空的宽或者高变成null。方便接下来判断
    ['width','height'].forEach(size => {
        if(style[size] === "auto" || style[size] === ""){
            style[size] = null
        }
        
    });

    if(!style.flexDirection || style.flexDirection === "auto"){
        style.flexDirection = "row"
    }
    if(!style.alignItems || style.alignItems === "auto"){
        style.alignItems = "stretch"
    }
    if(!style.justifyContent || style.justifyContent === "auto"){
        style.justifyContent = "flex-start"
    }
    if(!style.flexWrap || style.flexWrap === "auto"){
        style.flexWrap = "nowrap"
    }
    if(!style.alignContent || style.alignContent === "auto"){
        style.alignContent = "stretch"
    }
    
    // mainSign 从左还是从又开始
    // mainBase 从左或者从右开始的值
    var mainSize,mainStart,mainEnd,mainSign,mainBase,
    crossSize,crossStart,crossEnd,crossSign,crossBase;
    if(style.flexDirection === "row"){
        mainSize = "width"
        mainStart = "left"
        mainEnd = "right"
        mainSign = +1
        mainBase = 0

        crossSize = "height"
        crossStart = "top"
        crossEnd = "bottom"
    }
    if(style.flexDirection === "row-reverse"){
        mainSize = "width"
        mainStart = "right"
        mainEnd = "left"
        mainSign = -1
        mainBase = style.width

        crossSize = "height"
        crossStart = "top"
        crossEnd = "bottom"
    }
    if(style.flexDirection === "column"){
        mainSize = "height"
        mainStart = "top"
        mainEnd = "bottom"
        mainSign = +1
        mainBase = 0

        crossSize = "width"
        crossStart = "left"
        crossEnd = "right"
    }
    if(style.flexDirection === "column-reverse"){
        mainSize = "height"
        mainStart = "bottom"
        mainEnd = "top"
        mainSign = -1
        mainBase = style.height

        crossSize = "width"
        crossStart = "left"
        crossEnd = "right"
    }
    // 反向换行
    if(style.flexWrap === "wrap-reverse"){
        var tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    }else{
        crossBase = 0
        crossSign = 1
    }

    var isAutoMainSize = false
    // 如果父元素没有设置主轴属性
    if(!style[mainSize]){
        // 先把主轴的mainSize设置为0
        elementStyle[mainSize] = 0
        for(var i = 0; i< items.length; i++){
            var item = items[i]
            var itemStyle = getStyle(item)
            if(itemStyle[mainSize] !== null || itemStyle[mainSize]){
                elementStyle[mainSize] += elementStyle[mainSize]
            }
        }
        isAutoMainSize = true
    }

    // 每一行
    var flexLine = []
    // 所有的行
    var flexLines = [flexLine]
    // 剩余空间,初始值是父元素的mainSize
    var mainSpace = elementStyle[mainSize]
    var crossSpace = 0
    for(var i = 0; i < items.length; i++){
        var item = items[i]
        var itemStyle = getStyle(item)
        if(itemStyle[mainSize] === null){
            itemStyle[main] = 0
        }
        if(itemStyle.flex){
            // 如果元素有flex属性，说明元素是可以伸缩的。注意区别于display:flex
            flexLine.push(item)
        }else if(style.flexWrap === "nowrap" && isAutoMainSize){
            // 如果设置了nowrao,不换行，强行分配进第一行
            mainSpace -= itemStyle[mainSize]
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)){
                // 高度取相对高的那个，因为每行的高度是由最高值确定的
                crossSpace = Math.max(crossSpace,itemStyle[crossSize])
            }
            flexLine.push(item)
        }else{
            // 换行的逻辑
            if(itemStyle[mainSize] > style[mainSize]){
                // 如果子元素尺寸大于父元素尺寸，赋值为父元素尺寸
                itemStyle[mainSize] = style[mainSize]
            }
            if(mainSpace < itemStyle[mainSize]){
                // 如果剩余空间小于某个元素的主轴尺寸，强制换行
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace
                // 重启一行
                flexLine = [item]
                flexLine.push(flexLine)
                // 重置
                mainSpace = style[mainSize]
                crossSpace = 0
            }else{
                // 如果能放下
                flexLine.push(item)
            }
            // 计算交叉轴尺寸
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)){
                crossSpace = Math.max(crossSpace,itemStyle[crossSize])
            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace
    
    // 计算主轴
    if(style.flexWrap === "nowrap" || isAutoMainSize){
        // 如果不换行，保存一下交叉轴的高度
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    }else{
        flexLine.crossSpace = crossSpace
    }

    if(mainSpace < 0){
        // 如果mainSpace是负数，对多有元素根据主轴size进行等比例压缩
        var scale = style[mainSize] / (style[mainSize] - mainSpace)
        var currentMain = mainBase
        for(var i = 0; i < items.length; i++){
            var item = items[i]
            var itemStyle = getStyle(item)
            if(itemStyle.flex){
                // 如果有flex属性，没有权限压缩，就赋值为0
                itemStyle[mainSize] = 0
            }
            // 如果有主轴尺寸就乘以比例
            itemStyle[mainSize] = itemStyle[mainSize] * scale
            // 计算left、right
            // left等于当前主轴位置
            itemStyle[mainStart] = currentMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]

        }
    }else{
        flexLines.forEach(function(items) {
            var mainSpace = items.mainSpace
            var flexTotal = 0
            for(var i = 0; i < items.length; i++){
                var item = items[i]
                var itemStyle = getStyle(item)
                if((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))){
                    // 如果有flex属性，计算总的flex份数
                    flexTotal += itemStyle.flex
                    continue
                }
            }
            if(flexTotal > 0){
                // 有flex元素时，永远会占满整个行，用不到justifyContent属性
                var currentMain = mainBase
                for(var i = 0; i < items.length; i++){
                    var item = items[i]
                    var itemStyle = getStyle(item)
                    if(itemStyle.flex){
                        // 如果有flex属性，把mainSpace均匀分布给每个元素
                        // 剩余mainSpace除以总的flex值，乘以自己的份额，就是自己的mainSize
                       itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd]
                }
            }else{
                // 如果没有flex元素，就要用到justifyContent属性
                // 从左向右
                if(style.justifyContent === "flex-start"){
                    var currentMain = mainBase
                    var step = 0
                }
                // 从右向左
                if(style.justifyContent === "flex-end"){
                    var currentMain = mainSpace * mainSign + mainBase
                    var step = 0
                }
                if(style.justifyContent === "center"){
                    var currentMain = mainSpace / 2 * mainSign + mainBase
                    var step = 0
                }
                if(style.justifyContent === "space-between"){
                    var step = mainSpace / (items.length - 1) * mainSign
                    var currentMain = mainBase
                }
                if(style.justifyContent === "space-around"){
                    var step = mainSpace / items.length * mainSign
                    var currentMain = step / 2 + mainBase
                }
                for(var i = 0; i < items.length; i++){
                    var item = items[i]
                    itemStyle[mainStart] = currentMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currentMain = itemStyle[mainEnd] + step
                }
            }
        })
    }

    // 计算交叉轴
    var crossSpace
    if(!style[crossSize]){
        // 如果没有高度，crossSpace为0
        crossSpace = 0
        elementStyle[crossSize] = 0
        for(var i = 0; i < flexLines.length; i++){
            // 再加上撑开的高度
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
        }
    }else{
        // 如果有高度，先赋值
        crossSpace = style[crossSize]
        for(var i = 0; i < flexLines.length; i++){
            // 再减去每一行的高度
            crossSpace -= flexLines[i].crossSpace
        }
    }
    // flexWrap 影响从头到尾排还是从尾到头排
    if(style.flexWrap === "wrap-reverse"){
        crossBase = style[crossSize]
    }else{
        crossBase = 0
    }
    // 总体交叉轴尺寸 除以 行数，算出每行尺寸
    var lineSize = style[crossSize] / flexLines.length
    var step
    if(style.alignContent === "flex-start"){
        crossBase += 0
        step = 0
    }
    if(style.alignContent === "flex-end"){
        crossBase += crossSign * crossSpace
        step = 0
    }
    if(style.alignContent === "center"){
        crossBase += crossSign * crossSpace / 2
        step = 0
    }
    if(style.alignContent === "space-between"){
        crossBase += 0
        step = crossSpace / (flexLines.length - 1)
    }
    if(style.alignContent === "space-around"){
        step = crossSpace / flexLines.length
        crossBase += crossSign * step / 2
    }
    if(style.alignContent === "stretch"){
        crossBase += 0
        step = 0
    }
    flexLines.forEach(function(items){
        // 每一行尺寸
        var lineCrossSize = style.alignContent === "stretch" ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace
        for(var i = 0; i < items.length; i++){
            var item = items[i]
            var itemStyle = getStyle(item)

            var align = itemStyle.alignSelf || style.alignItems
            if(item === null){
                itemStyle[crossSize] = (align === "stretch") ? lineCrossSize : 0
            }
            if(align === "flex-start"){
                itemStyle[crossSize] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if(align === "flex-end"){
                itemStyle[crossSize] = crossBase + crossSign * lineCrossSize
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }
            if(align === "flex-start"){
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if(align === "stretch"){
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize]) ? itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] =  crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step)
    })
    console.log(items)

}


module.exports = layout