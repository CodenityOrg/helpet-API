const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/helpet", err => {
    console.log(err)
});