var express = require("express")
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
const { send } = require("process")

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = 'mongodb+srv://admin:admin@cluster0.y0i5k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message',{
    name : String,
    message : String
})
var messages =[
    {name:"John", message: "Hello"},
    {name:"Peter", message: "Hi"},

]

app.get('/messages',(req,res)=>{
    messages.find({}, (err,messages)=>{
        res.send(messages)
    })    
})

app.post('/messages',(req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
        messages.push(req.body)
        io.emit('message',req.body)
        res.sendStatus(200)    
    })
    
})

io.on('connection',(socket)=>{
    console.log('user connected')
})

mongoose.connect(dbUrl,(err)=>{
    console.log('mongodb connection successful')
})
var server = http.listen(3010, () => {
    console.log('Server is listening on port', server.address().port)    
})

