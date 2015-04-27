express-blog
============

Backend of my own blog based on node.

This project aims to replace my current wordpress blog.

### Goals:
- Source code fully documented
- Automatized testing
- 100% JavaScript (ES6)
- Be minimalist
- Complete separation of front-end from back-end

### Prerequisites to install
- Node (http://nodejs.org/)
- Babel - ES6 compiler (https://babeljs.io/)
- Express (http://expressjs.com/)
- MongoDB (http://www.mongodb.org/)
- Mongoose - Mongo ORM for JavaScript (http://mongoosejs.com/)
- npm - Node package manager (https://www.npmjs.com/)
- gulp - Streaming build system (http://gulpjs.com/)
- mocha - Test framework for node (http://mochajs.org/)

### Installation
Clone this repo
```
git clone https://github.com/mklakakilli/express-blog.git
```
Install global packages
```
npm install -g babel gulp mocha
```
Babel is JavaScript compiler which compiles next generation JavaScript into JavaScript of today.

Install project dependencies
```
npm install
```

### Development runtime
You can run development instance via gulp
```
gulp serve watch
```
It will run server in development environment with nodemon so the it will reload on every file change.

### Testing
#### Make a single run of tests
```
gulp test
```

#### Run tests while development
You can run tests while developing with default gulp task
```
gulp default
```
