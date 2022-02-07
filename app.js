const express = require('express');
const app = express();
const path = require('path');
const hosted = require('./routes/hostedauth');
const native = require('./routes/nativeauth');

require('dotenv').config()

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
    console.log("\nApplication started and Listening at http://localhost:3000/\n".inverse.green);
});

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/hostedauth', hosted.hostedAuth);
app.get('/success-hostedauth-server', hosted.hostedAuthSuccess);
app.get('/nativelanding', native.nativeAuthLadingPage);
app.get('/nativeauth', native.nativeAuth);
app.get('/success-native-auth', native.nativeAuthSuccess);

