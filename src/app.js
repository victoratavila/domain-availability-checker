const express = require('express');
const app = express();
const router = require('./Router/Routes');

express.json();
express.urlencoded({ extended: true })

app.use(router);

app.listen(8080, () => {
    console.log('The server is running');
})