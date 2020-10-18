module.exports = {
    entry:'./main.js',
    module:{
        rules: [
            {
                // 正则
                test:/\.js$/,
                // 使用的loader
                use:{
                    loader:"babel-loader",
                    options:{
                        presets:["@babel/preset-env"],
                        // 把编译后的文件里 react.createElement变成createElement
                        plugins:[["@babel/plugin-transform-react-jsx",{pragma:"createElement"}]]
                    }
                }
            }
        ]
    },
    mode:'development' //开发者模式，代码不再压缩
}