import mysql from "mysql2";
import Book from "./API/Book";

let instance: null | DbService = null;

let connection: mysql.Connection;

if (process.env.NODE_ENV === "production") {
  connection = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11515213",
    password: "rksW6QXreE",
    database: "sql11515213",
    port: 3306,
  });
} else {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sonnenberg01?",
    database: "it_firma",
    port: 3306,
  });
}

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("to database connected");
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      let response = await new Promise((resolve, reject) => {
        const query =
          "SELECT googleId, title, authors, thumbnail FROM it_firma.my_library";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async addNewBook(book: Book) {
    return await new Promise((resolve, reject) => {
      const query =
        "INSERT INTO `it_firma`.`my_library` (`Title`, `Authors`, `Thumbnail`, `GoogleId`) VALUES (?, ?, ?, ?)";
      connection.query(
        query,
        [book.title, book.authors, book.thumbnail, book.googleId],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  async deleteBook(book: Book) {
    try {
      return await new Promise((resolve, reject) => {
        const query =
          "DELETE FROM `it_firma`.`my_library` WHERE `GoogleId` = ?"
        connection.query(
          query,
          [book.googleId],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default DbService;
