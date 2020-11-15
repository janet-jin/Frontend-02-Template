 # 持续集成
## Git Hooks基本用法
* git hook来完成检查的时机
* git init之后 .git文件夹中hooks文件夹
* 例子
  1.创建pre-commit文件
  2.查看pre-commit权限，如果没有执行权限则执行：
  > chmod +x ./pre-commit
  3.在pre-commit写入：
  > #!/usr/bin/env node
    console.log("hello, hooks")
  4.执行git commit -m 'add readme'
## ESLint基本用法
  reference: https://eslint.org
* ESLint一种轻量级的代码检查方案
* 常用命令：
  npm install eslint --save-dev
  npx eslint --init
  npx eslint <file_name>

## ESLint API及其高级用法
  eslint 配合git hooks 一些高级用法
  常用命令：
  git stash push -k
  git stash pop

## 使用无头浏览器检查DOM
Chrome推出Headless：https://developers.google.com/web/updates/2017/04/headless-chrome
nodeJS库: puppeteer