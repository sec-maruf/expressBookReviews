const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
 
    // Check if username is valid
  return users.some(user => user.username === username);

}

const authenticatedUser = (username,password)=>{ 
    // Check if username and password match the one we have in records
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
  
    // Authenticate user
    if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
  
      // Store access token and username in session
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  // Check if the book with the provided ISBN exists
  if(books[isbn]){
    if(!books[isbn].reviews[username]){
        // Add a new review
        books[isbn].reviews[username]=review;
    }else{
        // Modify the existing review
        books[isbn].reviews[username]=review; 
    }
    res.status(200).send({ message: "Review successfully added/updated" });
  }else{
    // If the book does not exist, send a 404 Not Found status with an error message
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviews = req.query.reviews;
    const username = req.session.authorization.username;
    if(books[isbn]){
        if(books[isbn].reviews[username]){
            // Delete the user's review
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review for the "+isbn+" posted by the user "+username+ " deleted" });
        }else {
            // If the user has not posted a review
            return res.status(404).json({ message: "Review not found for this user" });
          }  
    }else{
      
        return res.status(404).json({ message: "Book not found" });

    }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
