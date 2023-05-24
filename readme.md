# 基于MQTT 和 express 的车机与用户通信代码
>   实现简单的小程序后台与车机安卓端通信

## 运行说明
```bash
node index.js
```

## 测试

>   测试前需要服务器安装mqtt的broker

>   使用https服务需要安装证书
```bash
mosquitto_sub -h 服务器ip -v -t "Driver/control"  #订阅消息

curl -X POST -H "Content-Type: application/json" -d '{"VIN":"1G4HP54K1XU587923"}' -k https://服务器ip:3000/Driver/sendData #发送测试消息，VIN为车架码

mosquitto_pub -h 服务器ip -t "Driver/status"  -m '{"longtitude": 108.96, "latitude": 34.26, "VIN":"00000000000000001", "Locker": 1}' #发布测试
```
