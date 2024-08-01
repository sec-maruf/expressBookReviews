const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password){

    users.push({"username": username , "password": password});
    res.status(200).json({message: "Customer successfully registered. Now you can login"});
  }else{

    return res.status(404).json({message: "Customer already exists!"});
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  res.send(JSON.stringify({books}, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(books[isbn]){
    res.send(books[isbn]);
  }else {
    res.status(404).send('Sorry, the book with ISBN '+isbn+ " can not be found");
  }
  

  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  // Extract the title parameter from the request object
  const author = req.params.author;

  //Get an array of book entries from the books object, filter them by author,
  // and then map the filtered entries to a new array with the desired properties
  const booksByAuthor = Object.entries(books) // Convert books object to an array of [isbn, book] pairs
  .filter(([isbn, book]) => book.author === author)// Filter books by the specified author
  .map(([isbn, book]) => ({isbn, title: book.title, reviews: book.reviews})); // Map the filtered entries to a new array with only isbn, title, and review
 
  // Check if any books with the specified author were found
  if(booksByAuthor.length > 0){

    // If books were found, send a 200 OK response with the books data in JSON format
    res.status(200).json({booksByAuthor});
  }else{

    // If no books were found, send a 404 Not Found response with an error message
    res.status(404).json("No books has been found by this author");
  }
  

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
// Extract the title parameter from the request object
 const title = req.params.title;

// Get an array of book entries from the books object, filter them by title,
// and then map the filtered entries to a new array with the desired properties
 const booksByTitle = Object.entries(books) // Convert books object to an array of [isbn, book] pairs
  .filter(([isbn, book]) => book.title === title) // Filter books by the specified title
  .map(([isbn, book])=>({isbn, author: book.author, review: book.reviews})); // Map the filtered entries to a new array with only isbn, author, and review

// Check if any books with the specified title were found
 if(booksByTitle.length > 0){

    // If books were found, send a 200 OK response with the books data in JSON format
    res.status(200).json({booksByTitle});
 }else{

    // If no books were found, send a 404 Not Found response with an error message
    res.status(404).json("No books has been found by this title"); 
 }

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Extract the 'isbn' parameter from the request object
  const isbn = req.params.isbn;
  // Check if the book with the provided ISBN exists in the 'books' object
  if(books[isbn]){
    // If the book exists, send the reviews of the book in the response
    res.send(books[isbn].reviews);
  }else {
    // If the book does not exist, send a 404 Not Found status with an error message
    res.status(404).send('Sorry, reviews has not been found by this isbn');
  }
  
});

module.exports.general = public_users;
