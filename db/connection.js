const mongoose = require('mongoose');
const Promise = require('promise');
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/helpet");