#AngularJS $ RESTful API Demo App

##Data model

3 entities are available in the API:
* Advertisers
* Pixels
* Pixel Fires

Advertisers contain pixels, while pixels contain pixel fires.

##Stack info:

* Backend: Python server running on SQLite
* Front end: AngularJS with AngularUI router, Twitter Bootstrap for presentation
* Workflow: Grunt.js

##Instructions

###Installing/launching the server:

To get the server running you will need to have the following:
* SQLite
* Python 2.7
* Bottle
* SQLAlchemy

Run 'python main.py' to to start it up

###Building the app

You will need to have node.js and npm:
* Run 'npm install'
* Run 'grunt' to build from src
* Run 'grunt watch' to trigger auto watch