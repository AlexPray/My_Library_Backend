import mysql from "mysql2";
import Book from "./API/Book";

let instance: null | DbService = null;

let connection: mysql.Connection;

connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: (process.env.DB_PORT) ? parseInt(process.env.DB_PORT, 10) : 3306,
});

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
          "SELECT googleId, title, authors, thumbnail FROM my_library";
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
        "INSERT INTO `my_library` (`Title`, `Authors`, `Thumbnail`, `GoogleId`) VALUES (?, ?, ?, ?)";
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
          "DELETE FROM `my_library` WHERE `GoogleId` = ?"
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
