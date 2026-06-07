import express from 'express';
import router from './router.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Rodando na porta ${port}.`);
});