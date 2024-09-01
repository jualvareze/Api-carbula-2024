
import express from 'express'
import cors from 'cors'
const app = express();
const port = 3000;
import scrapeAll from './mercadolibre/mercadolibre.js'

app.use(cors())

app.use(express.json());

app.post('/cotizar', async (req, res) => {
    const { marca,modelo,ano } = req.body;
    if (!marca) {
        return res.status(400).json({ error: 'falta informacion: marca' });
    }
    if (!modelo) {
        return res.status(400).json({ error: 'falta informacion: modelo' });
    }
    if (!ano) {
        return res.status(400).json({ error: 'falta informacion: año' });
    }
    const {listPage,price} =  await scrapeAll(marca.toLowerCase(),modelo.toLowerCase(),ano.toLowerCase()) 
    res.json({ list: listPage ,promedio: price });
});




app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});