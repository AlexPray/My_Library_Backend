import mysql from "mysql2";
import Book from "./API/Book";

let instance: null | DbService = null;

let connection: mysql.Connection;

connection = mysql.createConnection({
  host: "eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
  user: "uvsoll761qnzyjx2",
  password: "nxloveryb7e05h8j",
  database: "yuzpxzj7r4rbxu5a",
  port: 3306,
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
