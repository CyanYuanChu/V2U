const express = require('express');
const  fs  = require('fs');
const https = require('https');
const {parentPort} = require('worker_threads')
const bodyParser = require('body-parser')

const mess =  {
    longtitude:0,  // 经度
    latitude: 0, // 纬度
    Locker: false,
    VIN : "00000000000000000"
}

let data = {

}

// wirte status
parentPort.on('message', message=>{
    if(message.type = 'Driver/status'){

        console.log(message.data);
        try{
            const jsonObject = JSON.parse(message.data)
            mess.latitude = jsonObject.latitude
            mess.longtitude = jsonObject.longtitude
            mess.Locker = jsonObject.Locker
            mess.VIN = jsonObject.VIN
        } catch (error) {
            console.error("数据发送格式异常被捕获:", error.message);
        }
    }
})

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
https
    .createServer(
        {
            key: fs.readFileSync("key.pem"),
            cert: fs.readFileSync("cert.pem"),
        },
        app
    )
    .listen(3000, ()=>{
    console.log('Server listening on port 3000');
    })
// read status
app.get('/Driver/readStatus', function(req, res) {
    const result= {
        code: 200,
        longtitude: mess.longtitude,
        latitude: mess.latitude,
        Locker: mess.Locker,
        VIN: mess.VIN
    }
    res.json(result)
});

//TODO: post发送的应该是VIN码
app.post('/Driver/sendData', (req, res) => {
    // 从请求的主体中获取数据
    data = req.body;
    // 在这里进行处理逻辑
  
    // 返回响应给客户端
    const result= {
        code: 200,
        message:"发送数据成功"
    }
    parentPort.postMessage(JSON.stringify(data));
    res.json(result);
});

app.get('/Driver/readData', function(req, res) {
    const result= {
        code : 200,
        data : data
    }

    res.json(result)
});
