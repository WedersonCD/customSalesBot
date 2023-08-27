const express = require('express');
const app = express();
const  smartBotRoutes = require('./routes/smartBotRoutes');

app.use(express.json());
app.use('/', smartBotRoutes);


const hostname = '127.0.0.1';
const port = 3000;

app.listen(port,'0.0.0.0', () => {

    console.log(`Server running at http://${hostname}:${port}/`);

});