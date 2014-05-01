var mongoose = require('../modules/mongo').mongoose;
var crypto = require('crypto');

var Schema = mongoose.Schema;
//	, ObjectId = Schema.ObjectId;

var CommentSubSchema = new Schema({
	comment: {
		type: String,
		required: true
	},
	date:{
		type: Date,
		'default': Date.now
	},
	thread: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	}
});

var CommentsSchema = new Schema({
	comment: {
		type: String,
		required: true
	},
	date:{
		type: Date,
		'default': Date.now
	},
	thread: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	comments:[CommentSubSchema]
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
	},
	comments: [CommentsSchema],
	user: {
		type: String
	},
	icon: {
		type: String,
		'default':'chrome.png'
	}
});

var UserSchema = new Schema({
	email : {
		type: String,
		required: true,
		index: { unique: true }
	},
	nick: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	created_date: {
		type: Date,
		'default': Date.now
	},
	total_comments: {
		type: Number,
		'default': 0
	},
	posts: {
		type: Number,
		'default': 0
	},
	status:{
		type: String,
		'default': 'Desparchado'
	},
	threads: [ThreadSchema],
	image_url:{
		type: String,
		'default': 'ghost.png'
	}	
});



function hash (msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
};

UserSchema.statics.newUser = function (data, fn) {	
	//Validate the email

	var instance = new User({
		email: data.email,
		nick : data.nick,		
		password: hash(data.password, conf.secret) 
	});
	

	instance.save(function (err) {    	
        fn(err, instance);
    });
};

UserSchema.statics.list = function (callback) {
	this.find(function (err, users){
		if(err){
			callback(err);
		}
		else{
			callback(null, users);
		}
	});
}

UserSchema.statics.authenticate = function(data, callback){
	this.findOne({ email: data.email }, function(err, user){
		if(!user) {
			return callback('Usuario no encontrado');
		}
		if(user.password == hash(data.password, conf.secret)) {
			var helper = {
				nick: user.nick,				
				email: user.email,
				_id: user._id,
				key: hash('AniTaLaVaLaTiNaAniTaLaVaLaTiNa','EsterNoCleidoMasToiIdEo')
			}
			
			return callback(null, helper);
		}
		callback('Usuario/password invalido');
	});
}


UserSchema.statics.findByNick = function(data, callback){	
	this.findOne({ nick: data.nick },{password: 0, threads: 0}, function(err, user){
		if(!user) {
			return callback('Usuario no encontrado');
		}

		return callback(null, user);
	});
}

UserSchema.statics.checkEmail = function(check_email, callback){
	this.findOne({ email: check_email }, function(err, user){
		if(!user) {
			return callback(null, true);
		}
		else {
			return callback(null, false)
		}
	});
}

UserSchema.statics.getUserById = function(user_id, callback){
	this.findOne({ _id: user_id }, function(err, user){
		if(err){
			callback(err);
		}else{

			var helper = {
				nick: user.nick,				
				email: user.email,
				_id: user._id,
				key: hash('AniTaLaVaLaTiNaAniTaLaVaLaTiNa','EsterNoCleidoMasToiIdEo')
			}
			
			callback(null, helper)
		}		
	});
}

UserSchema.statics.updateUser = function(data, callback){
	this.update({
		_id:data.user_id
	},
	{
		$set: data
	},
	{
		safe:true
	},
	function(err, docs){		
		if(err){
			callback(err);
		} else {
			callback(null, docs);
		}
	});
}
UserSchema.statics.updateUserByNick = function(data, callback){
	this.update({
		nick:data.nick
	},
	{
		$set: data
	},
	{
		safe:true
	},
	function(err, docs){		
		if(err){
			callback(err);
		} else {
			callback(null, docs);
		}
	});
}

UserSchema.statics.newThread = function (data, callback) {		

	//Verificar que el usuario exista	
	this.findOne({nick: data.user},function (err, user){
		if(err){
			return callback(err);
		} else {
			if(!user){				
				callback("El usuario no existe");
				return;
			}

			thread = new Thread({
				title: data.title,
				description: data.description,
				user: data.user,	
				category:data.category,
				icon: data.icon
			});

			user.threads.push(thread);
			user.save(function(err){
				if(err){
					callback(err);
				} else {
					callback(null, thread);
				}
			});
			//
		}
	});
};

UserSchema.statics.incrementPosts = function(nick, callback){
	this.update(
		{
			nick:nick
		},
		{
			$inc: {posts:1}
		},
		{
			safe:true
		},
		function(err, docs){			
			if(err){
				callback(err);
			} else {
				callback(null, docs);
			}
	});
}

UserSchema.statics.getThreadsByCategory = function(category, callback){	
	this.find({'threads.category':category }, function(err, threads){
		if(err){
			callback(err);
		}
		else{
			var posts = [];			
			threads.forEach(function (thread) {				
				thread.threads.forEach(function(tales){
					if(tales.category === category){						
						var instance = {
							_id : tales._id,
							title: tales.title,
							last_comment: tales.last_comment,
							responses: tales.responses,
							user: thread.nick
						}						
						posts.push(instance);						
					}
				});
		    });

			callback(null, posts);
		}
	});	
}

UserSchema.statics.getThreadsById = function(thread_id,callback){	
	this.find({'threads._id':thread_id }, function(err, threads){
		if(err){
			callback(err);
		}
		else{
			var instance = {};
			var found = false;			
			threads.forEach(function (thread) {				
				thread.threads.forEach(function(tales){	

					if(tales._id == thread_id){		
						
						found = true;						
						instance = {
							_id : tales._id,
							title: tales.title,
							description: tales.description,														
							user: thread.nick,
							comments: tales.comments,
							total_comments: thread.total_comments,
							status: thread.status,
							posts: thread.posts,
							creator: thread._id,
							image_url: thread.image_url,
							icon: tales.icon
						}						
						return callback(null, instance);				
					}
				});
		    });

			if(!found) callback(null, instance);
		}
	});	
}


UserSchema.statics.newComment = function (data, callback) {		

	var comment = new Comment({
		comment: data.comment,
		thread: data.thread,
		user: data.nick				
	});

	this.update(
		{ _id: data.user, 'threads._id': data.thread }, 
		{ $push: { 'threads.$.comments': comment } }, 
		function(err,thread) {			
        if (!err){

        	User.update(
				{ _id: data.user, 'threads._id': data.thread }, 
				{
					$inc: {'threads.$.responses':1}					
				},				
				{
					safe:true
				},	
				function(err, docs){				

					User.update(
						{ nick: data.nick }, 
						{
							$inc: { total_comments: 1 }					
						},				
						{
							safe:true
						},	
						function(err, docs){

							total_comments: 1
							
							console.log(err);			
							if(err){
								callback(err);
							} else {
								callback(null, comment);
							}
					});
				});

        	 
        } else {
        	callback(err);
        }      
    });


/*
	this.findOne({'threads._id': data.thread}, {'threads.$': 1},function (err, thread) {
        if (!err) {            

            //callback(null, thread);

            if(!thread){				
				callback("El tema no existe");
				return;
			}

			comment = new Comment({
				comment: 'Comentario',
				thread: data.thread,
				user: 'mustaine'				
			});

			thread.threads[0].comments.push(comment);
			thread.save(function(err){
				if(err){
					callback(err);
				} else {
					callback(null, thread);
				}
			});	
        } else {
        	callback(err);
        }
    });*/

	//Verificar que el usuario exista	
	/*
	this.findOne({nick: data.user},function (err, user){
		if(err){
			return callback(err);
		} else {
			if(!user){				
				callback("El usuario no existe");
				return;
			}

			comment = new comment({
				comment: data.comment,
				thread: data.thread,
				user: data.user				
			});

			user.threads.comments.push(thread);
			user.save(function(err){
				if(err){
					callback(err);
				} else {
					callback(null, thread);
				}
			});
			//
		}
	});*/
}

UserSchema.statics.newCommentSub = function (data, callback) {		

	comment = new CommentSub({
		comment: 'SUB Comentario TRESSSS',
		thread: data.thread,
		user: 'mustaine'				
	});
	this.update({
	 _id: '519fcf405507c8dc1a000003', 
	 'threads._id': '51a2873b2d10b19c10000003',
	 'threads.comments._id': '51a2e8850fa05ae406000004' 
	}, 
		{ $push: { 'threads.$.comments.0.comments': comment } }, function(err,thread) {
        if (!err){
        	 callback(null, thread);
        } else {
        	callback(err);
        }       
    });
}

User = mongoose.model('user', UserSchema);
Thread = mongoose.model('thread', ThreadSchema);
Comment = mongoose.model('comment', CommentsSchema);
CommentSub = mongoose.model('comments.comment', CommentSubSchema);

exports.User = User;