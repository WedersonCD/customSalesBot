const express = require('express');
const app = express();
const  chatRoute = require('./routes/chatRoute');
const serverConfig = require('./configs/serverConfig');

app.use(express.json());
app.use('/', chatRoute);


const hostname = serverConfig.SERVER_HOST_NAME;
const port      = serverConfig.SERVER_PORT;

app.listen(port,'0.0.0.0', () => {

    console.log(`Server running at http://${hostname}:${port}/`);

});