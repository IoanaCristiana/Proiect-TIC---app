
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

app.post('/api/comenzi', async (req, res) => {
  try {
    const comanda = req.body;
    console.log("Am primit o comanda noua:", comanda.client.nume);

    await db.collection('orders').add(comanda);

    res.status(200).send({ message: 'Comanda salvata cu succes!' });
  } catch (error) {
    console.error("Eroare la salvare:", error);
    res.status(500).send({ message: 'Eroare interna' });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});