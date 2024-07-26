const express = require('express');
const booksRouter = require('./routes/books');

const app = express();
app.use(express.json());

app.post('/api/user/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
});

app.use('/api/books', booksRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`The server is running on http://localhost:${port}`);
});