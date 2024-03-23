import express from 'express';
import 'dotenv/config.js';

const app = express();

app.listen( process.env.PORT, () => {
    console.log(`Catalog service is running on port ${process.env.PORT}: http://localhost:${process.env.PORT}`)
} );