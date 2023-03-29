# ![Logo](./assets/WOG-logo1.png)

## Backend

Welcome to the backend side of World Of Games project.

## Description

A video game marketplace where users are required to register and log in to use the application. Once logged in, they can view all games, filter them by categories, add them to their shopping cart, create games, and view the details of each game.

Additionally, users can view their personal data, modify it, and log out.

## Implementation

backend project is build with:

- node.js: <https://nodejs.org/en>
- express: <https://expressjs.com/>
- mongodb: <https://www.mongodb.com>
- Typescript: <https://www.typescriptlang.org/>
- Jest: <https://jestjs.io/>

the structure of the project is class oriented and was designed in DDD(Domain, Driven, Design) in order to respect SOLID, KISS and DRY principals.

DDD: <https://en.wikipedia.org/wiki/Domain-driven_design>

## End Points

Users endpoints:

- Register a new user: POST → users/register
- Log in: POST  → users/login
- Retrieve user profile: GET →  /users/:userId
- Update user profile: PUT →  /users/:userId
- Delete a user: DELETE →  /users/:userId

Games endpoints:

- List all games: GET →  /games
- Get game details: GET →  /games/:id
- Add a new game: POST →  /games
- Edit a game: PUT → /games/:id
- Delete a game: DELETE → /games/:id

## How to install and run the project

- On github, copy the url to clone our repo;
- On your visualstudio, clone our repo in a new and empty folder;
- Open the terminal and write npm i;
- Write in the terminal npm start, the project will open;
- In the terminal, write npm start, the landing page should appear;
- Enjoy!

## Last information's

The project is 100% tested with jest and sonarCloud, with the implementation of supertest in order to check all the routes

- SonarCloud: <https://sonarcloud.io/summary/overall?id=isdi-coders-2023_Fabio-Di-Noia-Final-Project-back-202301-mad>;

Once you have the installed and run the project you will need the frontend to make it work:

- Front: <https://github.com/isdi-coders-2023/Fabio-Di-Noia-Final-Project-front-202301-mad>
