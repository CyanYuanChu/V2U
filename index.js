// 导入包依赖
const mqtt = require('mqtt')
const {Worker} = require('worker_threads')

const worker = new Worker('./app.js')


const client = mqtt.connect('http://localhost') // 连接本地mqtt brake
client.on('connect', ()=>{
    console.log('connect successful')
    client.subscribe('Driver/status', (err)=>{
        if(!err){
            console.log('subscribe: Driver/status')
        }
    })
})

client.on('message', (topic, message)=>{
    // console.log('接收到消息', message.toString())
    // console.log('接受到话题', topic.toString());
    worker.postMessage({type: 'Driver/status', data:message.toString()})
    // client.publish('test/abc', 'Hello World')
})

worker.on('message', (message) => {
    // 处理work线程的消息
    console.log(message); 
    client.publish('Driver/control', message)
})