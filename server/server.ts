import express, { Request, Response, NextFunction, response } from "express";
import DbService from "./database";
import cors from "cors";
import Book from "./API/Book";
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Show all books in database
app.get("/getBooks", (req, res) => {
  const db = DbService.getDbServiceInstance();
  const results = db.getAllData();
  results.then((data) => res.send(data)).catch((err) => console.log(err));
});

// Create new book in database by addButton
app.post("/addBook", (req, res) => {
  const db = DbService.getDbServiceInstance();
  db.addNewBook(req.body)
    .then(response => {
      console.log(req.body);

      res.json({ status: "success" }).status(200);
    })
    .catch(err => {
      let customErrorMsg = '';
      switch (err.code) {
        case 'ER_DUP_ENTRY':
          customErrorMsg = 'Book already in library';
          break;
        case 'ER_WRONG_VALUE_COUNT_ON_ROW':
          customErrorMsg = 'Something went wrong';
          break;
      }
      res.json({ status: "error", error: customErrorMsg, errrormsg: err.message }).status(200);
    });
});

// Remove book from database
app.delete("/removeBook", (req, res) => {
  const db = DbService.getDbServiceInstance();
  db.deleteBook(req.body)
    .then(response => {
      res.json({ status: "success" }).status(200);
    }).catch(err => {
      let customErrorMsg = '';
      if (err) {
        customErrorMsg = err.message;
        console.log(err);
      }
      res.json({ status: "error", error: customErrorMsg, errrormsg: err.message }).status(200);
    });
});

const PORT = process.env.PORT || 3030;

function resetLibrary() {
  const db = DbService.getDbServiceInstance();

  // DELETE ALL
  db.deleteAllBooks();

  // ADD some books
  const book2 = new Book();
  book2.title = "Why Not Hire Me?";
  book2.googleId = "aEGnMKBnuFIC";
  book2.authors = [''];
  book2.thumbnail = "http://books.google.com/books/content?id=aEGnMKBnuFIC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
  db.addNewBook(book2);
}
setInterval(resetLibrary, 10 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
