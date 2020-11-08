# 发布系统
  ## 服务器框架Express
  * 可以通过 npx （包含在 Node.js 8.2.0 及更高版本中）命令来运行 Express 应用程序生成
  器
  > npx express-generator
  * 对于较老的 Node 版本，请通过 npm 将 Express 应用程序生成器安装到全局环境中并执行即可。
  > $ npm install -g express-generator
    $ express

  ## 虚拟机安装
  * 工具：Oracle VM VirtualBox，Ubuntu 20.04.1 LTS 
  * 注意
  > 在Linux中安装node,用管理员权限安装:sudo apt install nodejs
  > 开启ssh：service ssh start
  > 虚拟机需要设置端口转发：在VirtualBox--网络--端口转发中设置
  > Linux中默认开启22接口
  * Windows 链接虚拟机传输文件
  > 在需要传送的文件夹中操作命令：
  > scp -P 8022 -r ./* root@127.0.0.1:/home/qiyue/server
  ## 发布系统流程
  publish-tool->publish-server->server
  ### publish-tool
  * 客户端，负责将需要发布的内容打包发布到服务端
  * 客户端压缩 archiver
  > npm install --save archiver
  > //会生成一个子文件夹
    archive.directory("./sample/", "newdir");
    //不会生成子文件夹
    archive.directory("./sample/",false);
  ### publish-server
  * 服务端，负责接收客户端发送的内容并更新到正式的服务器
  * 解压 unzipper
  > npm install unzipper --save
  * script命令
  > "start": "node ./server.js",
    // publish 负责把publish-server 推送到服务器上
    "publish": "scp -r ./* root@47.92.151.210:/usr/greektime/publish-server"
  ## Server
  * 服务器
