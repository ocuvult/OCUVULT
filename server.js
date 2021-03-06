var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
// var passport = require('passport');
// var social = require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

//supress warning
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://connect:Liveconnect1@ocuvult-shard-00-00.qqkxt.mongodb.net:27017,ocuvult-shard-00-01.qqkxt.mongodb.net:27017,ocuvult-shard-00-02.qqkxt.mongodb.net:27017/ocuvult?ssl=true&replicaSet=atlas-59z3j1-shard-0&authSource=admin&retryWrites=true&w=majority', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function() {
    console.log('Running the server on port ' + port );
});
