const express = require('express');
const { v4: uuid } = require('uuid');
const upload = require('../middlewares/upload');
const path = require('path');
// const Book = require('../components/classBook');

class Book {
    constructor(
        title = '',
        description = '',
        authors = '',
        favorite = '',
        fileCover = '',
        fileName = '',
        fileBook = '',
        id = uuid()
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}

const library = {
    books: []
};

const router = express.Router();

router.get('/', (req, res) => {
    const { books } = library;
    res.json(books);
});

router.get('/:id', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    const index = books.findIndex( book => book.id === id );
    if ( index !== -1 ) {
        res.json(books[index]);
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

router.post('/', (req, res) => {
    const { books } = library;
    const { title, description, authors, favorite, fileCover, fileName, id } = req.body
    const newBook = new Book( title, description, authors, favorite, fileCover, fileName, id )
    books.push(newBook);
    res.status(201);
    res.json(newBook);
})

router.put('/:id', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    const index = books.findIndex( book => book.id === id );
    if ( index !== -1 ) {
        books[index] = {
            ...books[index],
            ...req.body
        };
        res.json(books[index]);
    } else {
        res.status(404);
        res.json("404 | Книга не найдена");
    }
});

router.delete('/:id', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    if ( id === "all" ) {
        books.splice(0, books.length);
        res.json('Все книги удалены');
    } else {
        const index = books.findIndex( book => book.id === id );
        if ( index !== -1 ) {
            books.splice(index, 1);
            res.json('Ok');
        } else {
            res.status(404);
            res.json("404 | Книга не найдена");
        }
    }
});

router.post('/upload', upload.single('fileBook'), (req, res) => {
    const { books } = library;
    const { title, description, authors, favorite, fileCover, fileName} = req.body;
    const fileBookPath = req.file.path;
    const newBook = new Book( 
        title, 
        description, 
        authors, 
        favorite,
        fileCover,
        fileName,
        fileBookPath
    );

    books.push(newBook);
    res.status(201);
    res.json(newBook);
});

router.get('/:id/download', (req, res) => {
    const { books } = library;
    const { id } = req.params;
    const book = books.find(b => b.id === id);

    if (book && book.fileBook) {
        res.download(path.resolve(book.fileBook), book.fileName);
    } else {
        res.status(404)
        res.json('Книга не найдена');
    }
});

module.exports = router;
