const express = require('express');
const config = require('./config/config');
const morgan = require('morgan');
const wordroutes = require('./controller/word_embedding_controller')
const s3routes = require('./controller/s3_files');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(wordroutes);
app.use(s3routes);

app.listen(config.app_port, () => {
    console.log(`server listerning on port: http://localhost:${config.app_port}`);
})