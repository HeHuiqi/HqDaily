
const http = require('http');
const request = require('request');

const host = '127.0.0.1';
const port = 9000;
const imgPort = 8999;

//API代理

const apiServer = http.createServer((req,res) => {
    const url = 'http://news-at.zhihu.com/api/4'+req.url;
    const options = {
        url:url,
    };
    console.log('API:url ==' +url);
    function callback(error,response,body) {
        if (!error && res.statusCode === 200) {
            //设置编码类型
            res.setHeader('Content-Type','text/plan;charset=UTF-8');
            //设置允许跨域
            res.setHeader('Access-Control-Allow-Origin','*');
            //返回代理后的内容
            // console.log('API:body ==' +body);

            res.end(body);
        }
    }

    request.get(options,callback);
});

apiServer.listen(port,host,() => {
    console.log(`API代理：http://${host}:${port}`);
});

//图片代理

const imgServer = http.createServer( (req,res) =>{


    const url = req.url.split('/img/')[1];
    const options = {
        url:url,
        encoding:null,
    };
    console.log('图片:url ==' +url);

    function callback(error,response,body) {
        if (!error && response.statusCode === 200) {
            const contentType = response.headers['content-type'];
            res.setHeader('Content-Type',contentType);
            res.setHeader('Access-Control-Allow-Origin','*');
            res.end(body);
        }
    }
    request.get(options,callback);
});

imgServer.listen(imgPort,host,() => {
    console.log(`图片代理：http://${host}:${imgPort}/`)
});