'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
    title : String,
    options : [{
      optionTitle:String,
      votes:Number
    }],
    creator:String
});

module.exports = mongoose.model('Poll', Poll);



     