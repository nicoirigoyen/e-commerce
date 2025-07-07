import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import featuredRoutes from './routes/featuredRoutes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI_LOCAL)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

// Middleware para registrar encabezados
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  next();
});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/keys/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  next();
});

app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/featured', featuredRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//const port = process.env.PORT || 5001;
//app.listen(port, () => {
//  console.log(`serve at http://localhost:${port}`);
//});

//Local para ver en celu
const port = process.env.PORT || 5001;
app.listen(port, '0.0.0.0',() => {
  console.log(`serve at http://0.0.0.0:${port}`);
});
