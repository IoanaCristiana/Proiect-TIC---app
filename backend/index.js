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
    const userCheck = await db.collection('users').where('email', '==', email).get();
    if (!userCheck.empty) return res.status(400).send({ message: 'Email deja folosit!' });

    const salt = await bcrypt.genSalt(10);
    const parolaCriptata = await bcrypt.hash(parola, salt);
    const rol = (codSecret === 'SEF') ? 'admin' : 'client';

    const newUser = { nume, email, parola: parolaCriptata, rol, dataInregistrare: new Date().toISOString() };
    await db.collection('users').add(newUser);
    res.status(201).send({ message: 'Cont creat!', rol });
  } catch (error) {
    console.error("Eroare Register:", error);
    res.status(500).send({ message: 'Eroare server' });
  }
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, parola } = req.body;
    const usersRef = await db.collection('users').where('email', '==', email).get();
    if (usersRef.empty) return res.status(400).send({ message: 'Email/Parolă greșite!' });

    const userDoc = usersRef.docs[0];
    const userData = userDoc.data();
    const validPassword = await bcrypt.compare(parola, userData.parola);
    if (!validPassword) return res.status(400).send({ message: 'Email/Parolă greșite!' });

    res.status(200).send({ id: userDoc.id, ...userData });
  } catch (error) {
    console.error("Eroare Login:", error);
    res.status(500).send({ message: 'Eroare server' });
  }
});


// 3. adaugare produs
app.post('/api/products', async (req, res) => {
  try {
    const produsNou = req.body;
    console.log("Incerc sa adaug produsul:", produsNou.name); 


    produsNou.price = Number(produsNou.price);
    produsNou.stoc = Number(produsNou.stoc);
    
    await db.collection('products').add(produsNou);
    console.log("Produs adaugat cu succes in DB!"); 
    
    res.status(201).send({ message: 'Produs adaugat!' });
  } catch (error) {
    console.error("Eroare la adaugare produs:", error); 
    res.status(500).send({ message: 'Eroare la adaugare' });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(products);
  } catch (error) {
    console.error("Eroare citire produse:", error);
    res.status(500).send({ message: 'Eroare la citire' });
  }
});

// modificare produs
app.put('/api/products/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.price) updates.price = Number(updates.price);
    if (updates.stoc) updates.stoc = Number(updates.stoc);
    await db.collection('products').doc(req.params.id).update(updates);
    res.status(200).send({ message: 'Actualizat!' });
  } catch (error) {
    console.error("Eroare update:", error);
    res.status(500).send({ message: 'Eroare server' });
  }
});

// sterge produs
app.delete('/api/products/:id', async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.status(200).send({ message: 'Sters!' });
  } catch (error) {
    console.error("Eroare stergere:", error);
    res.status(500).send({ message: 'Eroare server' });
  }
});


app.post('/api/comenzi', async (req, res) => {
  try {
    const comanda = req.body;
    console.log("Comanda noua primita. Procesez stocurile...");

    await db.collection('orders').add(comanda);

    if (comanda.produse && Array.isArray(comanda.produse)) {
      for (const produs of comanda.produse) {
        if (produs.id) {
          const productRef = db.collection('products').doc(produs.id);
          
          const doc = await productRef.get();
          if (doc.exists) {
            const dateProdus = doc.data();
            const stocCurent = Number(dateProdus.stoc) || 0;
            
            const cantitateCeruta = Number(produs.quantity) || 1; 

            let stocNou = stocCurent - cantitateCeruta;
            
            if (stocNou < 0) stocNou = 0;

            await productRef.update({ stoc: stocNou });
            console.log(`Stoc actualizat pentru ${dateProdus.name}: ${stocCurent} - ${cantitateCeruta} = ${stocNou}`);
          }
        }
      }
    }

    res.status(200).send({ message: 'Comanda salvata si stoc actualizat!' });
  } catch (error) {
    console.error("Eroare procesare comanda:", error);
    res.status(500).send({ message: 'Eroare comanda' });
  }
});

app.get('/api/comenzi', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('data', 'desc').get();
    const comenzi = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(comenzi);
  } catch (error) {
    console.error("Eroare citire comenzi:", error);
    res.status(500).send({ message: 'Eroare citire' });
  }
});

app.delete('/api/comenzi/:id', async (req, res) => {
  try {
    await db.collection('orders').doc(req.params.id).delete();
    res.status(200).send({ message: 'Sters!' });
  } catch (error) {
    console.error("Eroare stergere comanda:", error);
    res.status(500).send({ message: 'Eroare server' });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});