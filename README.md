## 运行说明

* 开启代理服务器
```
cd HqDaily/src
node proxy.js
```
* 运行本项目
```
cd HqDaily
npm install
npm run dev

```
注意知乎日报api会发生变化，请自行抓包查看

### package.json 说明

```

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --history-api-fallback --config   webpack.config.js",
    "build": "webpack --progress --hide-modules --config webpack.prd.config.js"
  },
  
  --history-api-fallback：在服务端配置 h5 history模式，相应的在Vue的router的设置为{mode:'history'}
  --open：会自动打开浏览器
  --config:指定webpack配置文件
```

### npm install --save 和 npm install --save-dev

--save 表示安装模块的时候把它写到package.json文件中的dependencies字段中
--save-dev 表示安装模块的时候把它写到package.json文件中的devDependencies字段中