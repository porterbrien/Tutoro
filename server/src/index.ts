import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/', (_req, res) => {
  res.send('API running from the backend 🎉');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
