# Instructions


## Intro

This is readme and instructions how start using node backend bundle from Akveo. Backend bundle is integrated solution of Node Backend Code and Angular Frontend code. Backend code plays mostly API role, giving data to the client side as REST API. 

## Running Instruction

1) install mongoDB locally or register mongoDB in some hosting. in case of local node run command: `mongod` in separate terminal

2) setup connection to mongoDB in `config/default.js`

```
db: {
url: 'mongodb://localhost:27017/bundle-node',
name: 'bundle-node',
},
```

Install and run the app
```
npm install
npm start
```

test that node api is running by opening `http://localhost:3001/api` 

## Test User / Password

You can use these test users for application testing:

1. user@user.user / 12345
2. admin@admin.admin / !2e4S

## Development

While developing node.js api we suggest to use `npm run dev` command, because it runs `nodemon` module to watch over changes and re-run node api automatically.

## API Documentation

You can check API documentation by running api and accessing http://localhost:3001/api/swagger link.

To use swagger with token authentication please follow these steps:
 - open swagger link `http://localhost:3001/api/swagger` while running api
 - expand `**Auth**` controller and open `POST /auth/login` action
 - click `try out` and put correct user info into loginDto field (there is sample in swagger). Click `execute`
 - when received response with token, copy token `access_token` (ctrl+c)
 - click `Authorize` button. Paste there token in format: `Bearer <token>` and click `Authorize`
 - after UI was refreshed, you can try any requests, token will be added there
