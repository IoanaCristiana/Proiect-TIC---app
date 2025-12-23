
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { db } from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Serverul functioneaza si este conectat la Firebase!');
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});