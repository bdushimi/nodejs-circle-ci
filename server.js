
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = process.env.PORT || 3000;


//call routes
const articleRoutes = require("./app/routes/article");
const userRoutes = require("./app/routes/user");
const professionRoutes = require("./app/routes/profession");
const serviceRoutes = require("./app/routes/service");
const skillRoutes = require("./app/routes/skill");
const querieRoutes = require("./app/routes/querie");
const commentRoutes = require("./app/routes/comment");


//const db = require('./db.js');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = { 
				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
// mongoose.connect(config.DBHost, options);
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
mongoose.set('useUnifiedTopology', true);

mongoose.connect(config.DBHost, options, { useNewUrlParser: true }, (err) => {
	if (err)
	   console.error(err);
	else
	   console.log("Connected to the mongodb"); 
});

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  



app.get("/", (req, res) => res.json({message: "Welcome to my personal blog rest api!"}));


//Routes that handles requests
app.use("/article", articleRoutes);
app.use("/user", userRoutes);
app.use("/profession", professionRoutes);
app.use("/service", serviceRoutes);
app.use("/skill", skillRoutes);
app.use("/querie", querieRoutes);
app.use("/comment", commentRoutes);



//server port
app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing