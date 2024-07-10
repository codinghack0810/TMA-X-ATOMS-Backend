import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

import dbConnect from './src/config/dbConnect.js';
import router from './src/router/api/v1/index.js';

dotenv.config();

dbConnect();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8080;

console.log(HOST, PORT);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/v1', router);

app.listen(PORT, HOST, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
