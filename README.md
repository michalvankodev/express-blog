express-blog
============

My own blog based on the MEAN stack.

This project aims to replace my current wordpress blog.

### Goals:
- Source code fully documented
- Automatized back-end and front-end testing
- 100% JavaScript stack
- Be minimalist
- Complete separation of front-end from back-end

### Prerequisites
- npm - Node package manager (https://www.npmjs.com/)
- bower - (http://bower.io/)
- karma - Karma unit test runner (http://karma-runner.github.io/)
- protractor - Protractor e2e testing framework (http://angular.github.io/protractor/#/)
- gulp - Streaming build system (http://gulpjs.com/)

#### Front-end
- Angular - 1.3 (https://www.angularjs.org/)
- UI Router (http://angular-ui.github.io/ui-router/site/#/api/ui.router)
- Less (http://lesscss.org/)
- Bower (http://bower.io/)

##### CMS
- Angular Material (https://material.angularjs.org/#/)

#### Back-end
- Node (http://nodejs.org/)
- Express (http://expressjs.com/)
- MongoDB (http://www.mongodb.org/)
- Mongoose - Mongo ORM for JavaScript (http://mongoosejs.com/)

### Installation
Clone this repo

    git clone https://github.com/mklakakilli/express-blog.git

Install npm dependencies

    npm install

Install bower dependecies for front-end JavaScript libraries

    bower install


### Development runtime
You can run development instance via gulp

    gulp serve watch
It will run server and livereload server for development purpose

To get livereload visit (http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-)

### Testing
#### Make a single run of tests

- Karma unit tests

      karma start karma.client.conf.js --single-run
      karma start karma.admin.conf.js --single-run

- Integration tests

      protractor

- Server tests

      gulp test-server

#### Run tests while development
To run development server with on save testing of units and server specs.

    gulp default

This command will run server and selenium browsers for testing front-end unit specs and server specs on every save.
