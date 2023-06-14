const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "usersDetails.db");

const app = express();

app.use(express.json());

let database = null;

//Data base Intialization

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () =>
      console.log("Server Running at http://localhost:4000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
    return {
      Id: dbObject.id,
      Name: dbObject.name,
      Email: dbObject.email
    };
  };

  //Create the Users Table 
  database.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('users table created.');
});

//Create a new User

app.post("/users/", async (request, response) => {
    const { Name, Email } = request.body;
    const postUserQuery = `
    INSERT INTO
      users (name, email)
    VALUES
      ('${Name}', ${Email});`;
    const user = await database.run(postUserQuery);
    response.send("user Added");
  });
  
//Get the single User Details

  app.get("/users/:userId/", async (request, response) => {
    const { Id } = request.params;
    const getUserQuery = `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        id = ${Id};`;
    const user = await database.get(getUserQuery);
    response.send(convertDbObjectToResponseObject(user));
  });

  // Get the all the Users Details

  app.get("/users/", async (request, response) => {
    const getUserQuery = `
      SELECT
        *
      FROM
        users;`;
    const userArray = await database.all(getUserQuery);
    response.send(
      userArray.map((eachUser) =>
        convertDbObjectToResponseObject(eachUser)
      )
    );
  });

//Update the User

  app.put("/users/:userId/", async (request, response) => {
    const { Name, Email } = request.body;
    const { Id } = request.params;
    const updateUserQuery = `
    UPDATE
      users
    SET
      name = '${Name}',
      email = ${Email}
    WHERE
      id = ${Id};`;
  
    await database.run(updateUserQuery);
    response.send("User Details Updated");
  });

//Delete a Single User from the table

  app.delete("/users/:userId/", async (request, response) => {
    const { Id } = request.params;
    const deleteUserQuery = `
    DELETE FROM
      users
    WHERE
      id = ${Id};`;
    await database.run(deleteUserQuery);
    response.send("User Removed");
  });


  module.exports = app;