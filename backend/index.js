import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; 
import { db } from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[CERERE PRIMITA] ${req.method} ${req.url}`);
  next();
});

app.post('/api/register', async (req, res) => {
  try {
    const { nume, email, parola, codSecret } = req.body;
    console.log("Incercare inregistrare pentru:", email);

    const userCheck = await db.collection('users').where('email', '==', email).get();
    if (!userCheck.empty) {
      return res.status(400).send({ message: 'Acest email este deja folosit!' });
    }

    const salt = await bcrypt.genSalt(10);
    const parolaCriptata = await bcrypt.hash(parola, salt);

    const rol = (codSecret === 'SEF') ? 'admin' : 'client';

    const newUser = {
      nume,
      email,
      parola: parolaCriptata,
      rol,
      dataInregistrare: new Date().toISOString()
    };
    
    await db.collection('users').add(newUser);
    console.log("User creat cu succes!");

    res.status(201).send({ message: 'Cont creat cu succes!', rol });
  } catch (error) {
    console.error("Eroare register:", error);
    res.status(500).send({ message: 'Eroare la inregistrare' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, parola } = req.body;
    console.log("Incercare login pentru:", email);

    const usersRef = await db.collection('users').where('email', '==', email).get();
    if (usersRef.empty) {
      return res.status(400).send({ message: 'Email sau parolă greșită!' });
    }

    const userDoc = usersRef.docs[0];
    const userData = userDoc.data();

    const validPassword = await bcrypt.compare(parola, userData.parola);
    if (!validPassword) {
      return res.status(400).send({ message: 'Email sau parolă greșită!' });
    }

    res.status(200).send({
      id: userDoc.id,
      nume: userData.nume,
      email: userData.email,
      rol: userData.rol
    });

  } catch (error) {
    console.error("Eroare login:", error);
    res.status(500).send({ message: 'Eroare la server' });
  }
});

app.post('/api/comenzi', async (req, res) => {
  try {
    const comanda = req.body;
    console.log("Comanda noua de la:", comanda.client.nume);
    await db.collection('orders').add(comanda);
    res.status(200).send({ message: 'Comanda salvata!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Eroare comanda' });
  }
});

app.get('/api/comenzi', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('data', 'desc').get();
    const comenzi = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(comenzi);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Eroare citire comenzi' });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});