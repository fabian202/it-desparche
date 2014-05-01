if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
	var mongo = {
	  "hostname":"localhost",
	  "port":27017,
	  "username":"",
	  "password":"",
	  "name":"",
	  "db":"desparche"
	}
}

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var Mongo = {};

//exports.mongourl = generate_mongo_url(mongo);

//exports.mongoObj = require('mongodb');

var mongoose = require('mongoose');
//var Mongo = require('../modules/mongo')  

mongoose.connect(generate_mongo_url(mongo));
console.log(':::::::::::CONNECTION::::::::::::')
mongoose.connection.on('error', function(err){
    console.log(err);
});

exports.mongoose = mongoose;