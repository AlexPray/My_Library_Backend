import express, { Request, Response, NextFunction, response } from "express";
import DbService from "./database";
import cors from "cors";
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

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
