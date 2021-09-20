# Fullstack GraphQL Messenger 

#### Technology Used
* React.js
* GraphQL
* PostgreSQL
* Sequelize 

#### Software Requirements
* Node.js
* NPM 

## Installation and Running

#### Client 
* In main directory terminal 1 `cd client_apollo_react`
* `npm install`
* `npm start`
* Visit client at `http://localhost:3000`

#### Database Config 
* Switch over to the postgres account on your server by typing in the terminal:
```sudo -i -u postgres```
* You can now access the PostgreSQL prompt immediately by typing:
```psql```
* You will need to create a database with the correct permissions and link it to your ```.env``` file
* The variables are as follows: 
```
REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
DATABASE=your_db_name_you_created
DATABASE_USER=postgres
DATABASE_PASSWORD=swordfish
SECRET=xxx
```

#### Server 
* In main directory terminal 2 `cd server_apollo_express_postgresql`
* `npm install`
* `npm start`
* Visit GraphQL PlayGround at `http://localhost:8000/graphql` 