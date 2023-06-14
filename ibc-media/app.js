const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const db = require('./db');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());

const convertDbObjectToResponseObject = (dbObject) => {
    return {
      Id: dbObject.id,
      Name: dbObject.name,
      Email: dbObject.email
    };
  };

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

//start the server
  app.listen(4000, () => {
    console.log("Server Running at http://localhost:4000/");
  });