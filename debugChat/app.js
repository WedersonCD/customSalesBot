const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3050;
const axios = require('axios')


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

const mainURL='http://localhost:3000/'


io.on('connection', async (socket) => {
    console.log('user login')
    const chatId = await axios.post(mainURL+'createChat',{
        "user":{
            "name":"kero",
            "age":18,
            "gender":"masculino"
        }
    })
    .then((response)=>{
        socket.emit('chat awnser',response.data.message)
        return response.data.chatId
    })
    console.log(chatId)
    socket.on('chat question', async (msg) => {
        const awnser = await axios.post(mainURL+'sendChatMessage',{
            "chatId":chatId,
            "message":msg
        })
        .then((response)=>{
        socket.emit('chat awnser',response.data.awnser)

        })
        
    });
  });
