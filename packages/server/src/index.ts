import express from 'express';

const app = express();

const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send('works');
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
