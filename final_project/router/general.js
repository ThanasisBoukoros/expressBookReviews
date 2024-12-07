const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    if (users.some(user => user.username === username)) {
        return res.status(409).json({message: "Username already exists"});
    }
    
    users.push({ username, password });
    return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   try {
        res.status(200).json(JSON.stringify(books));
    } catch(error) {
        res.status(500).json({message: "Error getting books"});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
     const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(JSON.stringify(books[isbn]));
    }
    return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => 
        book.author.toLowerCase() === author.toLowerCase()
    );
    
    if (booksByAuthor.length > 0) {
        return res.status(200).json(JSON.stringify(booksByAuthor));
    }
    return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (booksByTitle.length > 0) {
        return res.status(200).json(JSON.stringify(booksByTitle));
    }
    return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(JSON.stringify(books[isbn].reviews));
    }
    return res.status(404).json({message: "No reviews found for this book"});
});

module.exports.general = public_users;
