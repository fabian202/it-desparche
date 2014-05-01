var mongoose = require('../modules/mongo').mongoose;
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	date:{
		type: Date,
		'default': Date.now
	}
});

var ThreadSchema = new Schema({
	title:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	comments:[CommentsSchema],
	responses:{
		type: Number,
		'default': 0
	},
	last_comment:{
		type: String,
		'default': ''		
	},
	category:{
		type: String,
		required: true
	}
});

ThreadSchema.statics.getThreadsByCategory = function(category, callback){
	this.find({ category: category }, function(err, threads){
		if(err){
			callback(err);
		} else {
			callback(null, threads);
		}
	});
}

ThreadSchema.statics.newThread = function (data, callback) {		

	var instance = new Thread({
		title: data.title,
		description: data.description,
		user: data.user,	
		category:data.category
	});	

	instance.save(function (err) {
    	console.log(err);
        callback(err, instance);
    });
};

Thread = mongoose.model('thread', ThreadSchema);

exports.Thread = Thread;