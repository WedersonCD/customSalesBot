const express   = require('express');
const socketIo  = require("socket.io");

const app = express();

const serverConfig = require('./configs/serverConfig');

const  chatRoute = require('./routes/chatRoute');
const  simpleChatRoute = require('./routes/simpleChatRoute');

const hostname = serverConfig.SERVER_HOST_NAME;
const port      = serverConfig.SERVER_PORT;

const server = app.listen(port,'0.0.0.0', () => {

    console.log(`Server running at http://${hostname}:${port}/`);

});

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('user login')
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
  });


app.use(express.json());
app.use('/', chatRoute);
app.use('/simpleChat', simpleChatRoute);
