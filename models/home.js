var mongoose = require('../modules/mongo').mongoose;
var Schema = mongoose.Schema;

var HomeSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	type: {
		type: String,
		'default': 'thread'
	},
	title:{
		type: String,
		required: true
	},
	thread_id: {
		type: String,
		required: true		
	},
	icon:{
		type: String,
		'default': 'chrome.png'
	},
	date: {
		type: Date,
		'default': Date.now
	}
});

HomeSchema.statics.newHome = function (data, callback) {		

	var instance = new Home({
		user: data.user,
		type: data.type,
		title: data.title,	
		thread_id:data.thread_id,
		icon: data.icon
	});	

	instance.save(function (err) {    	
        callback(err, instance);
    });
};

HomeSchema.statics.getHome = function (type, callback) {		

	this.find({ type: type },{},
		{  
			limit: 10,
			sort:{
        		date: -1 //Sort by Date Added DESC
			} 
		}, function(err, news){
		if(err){
			callback(err);
		} else {
			callback(null, news);
		}
	});
};

HomeSchema.statics.getHomeByUser = function (type,user, callback) {		

	this.find({ type: type, user: user },{},
		{  
			limit: 12,
			sort:{
        		date: -1 //Sort by Date Added DESC
			} 
		}, function(err, news){
		if(err){
			callback(err);
		} else {
			callback(null, news);
		}
	});
};

Home = mongoose.model('home', HomeSchema);

exports.Home = Home;