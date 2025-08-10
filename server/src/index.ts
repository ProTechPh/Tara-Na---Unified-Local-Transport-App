import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { router as routesRouter } from './routes/routes';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'tara-na-server' });
});

app.use('/routes', routesRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
