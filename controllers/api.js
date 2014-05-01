//Model References
var User = require('../models/user.js').User;
var Category = require('../models/categories.js').Category;
var Home = require('../models/home.js').Home;

module.exports = function(app){
    app.get('/check_email', function(req, res){    	
        User.checkEmail(req.query["reg-email"], function(err, response){
        	res.send(response);
        });
    });

	app.post('/register', function(req,res){
		User.newUser(req.body,function(err,data){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				res.contentType('json');
			 	res.write(JSON.stringify({response:'json'}));
				res.end();
			}
		});	
	});

	app.post('/login', function(req, res){		
		User.authenticate(req.body, function(err, user){			
			if(err == null){
				res.contentType('json');
			 	res.write(JSON.stringify(user));
				res.end();
			} else {				
				res.writeHead(500);
				res.end(err);
			}
		});
	});

	app.get('/categories', function(req, res){
		Category.getCategories(function(err, cats){			
			res.contentType('json');
		 	res.write(JSON.stringify({categories: cats}));
			res.end();
		});
	});

	app.get('/populateData', function(req, res){
		Category.populateData(function(err){			
			res.contentType('json');
		 	res.write(JSON.stringify({categories: ''}));
			res.end();
		});
	});

	app.get('/category/:id', function(req, res){		
		User.getThreadsByCategory(req.params.id, function(err, threads){

			Category.getCategoriesById(req.params.id,function(err, category){
				if(!err) { 
					res.contentType('json');
				 	res.write(JSON.stringify({threads: threads, category: category.image_url}));
					res.end();
				}
			});		
		});
	});

	app.get('/thread/:id', function(req, res){		
		User.getThreadsById(req.params.id, function(err, thread){
			res.contentType('json');
		 	res.write(JSON.stringify({thread: thread}));
			res.end();
		});
	});

	app.post('/tema', function(req, res){	
		//Create the thread	
		var body = req.body;
		User.newThread(body,function(err,data){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				//Increment number pf threads of the category
				Category.incrementThread(data.category, function(err, docs){
					if(!err){

						//increment posts of the user						
						User.incrementPosts(data.user, function(err, foo){
							if(!err){
								//save to the homenews

								//estos se necesitan para el home
								var instance = new Home({
									user: body.user,
									type: 'thread',
									title: body.title,	
									thread_id:data._id,
									icon: body.icon
								});	
								
								//Save for the home news
								Home.newHome(instance, function(err, inst){
									if(err){
										res.writeHead(500);
										res.end(err);
									} else {
										res.contentType('json');
									 	res.write(JSON.stringify({response:data}));
										res.end();
									}
								});						
							} else {
								res.writeHead(500);
								res.end(err);
							}							
						});					
					} else {
						res.writeHead(500);
						res.end(err);
					}
				});

				
			}
		});	
	});

	app.post('/newcomment', function(req, res){		
		User.newComment(req.body, function(err, thread){

			//estos se necesitan para el home
			var instance = new Home({
				user: req.body.nick,
				type: 'comment',
				title: req.body.title,	
				thread_id: req.body.thread,
				icon: req.body.icon
			});	

			//Save for the home news
			Home.newHome(instance, function(err, inst){
				if(err){
					res.writeHead(500);
					res.end(err);
				} else {
					res.contentType('json');
				 	res.write(JSON.stringify({thread: thread}));
					res.end();
				}
			});	

		
		});
	});

	app.get('/threadtest', function(req, res){
		var data = {					 
			thread: '51a2873b2d10b19c10000003'
		};

		User.newCommentSub(data, function(err, thread){
			res.contentType('json');
		 	res.write(JSON.stringify({thread: thread}));
			res.end();
		});
	});

	app.get('/homethreads/:type', function(req, res){

		Home.getHome(req.params.type, function(err, news){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				res.contentType('json');
			 	res.write(JSON.stringify({news: news}));
				res.end();
			}
		});
	});

	app.get('/homethreads/:user/:type', function(req, res){

		Home.getHomeByUser(req.params.type,req.params.user, function(err, news){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				res.contentType('json');
			 	res.write(JSON.stringify({news: news}));
				res.end();
			}
		});
	});

	app.post('/homethreads',function(req, res){
		Home.newHome(req.body, function(err, inst){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				res.contentType('json');
			 	res.write(JSON.stringify({response:'json'}));
				res.end();
			}
		});
	});

	app.get('/perfil/:nick', function(req, res){	
		var data = { nick: req.params.nick };
		User.findByNick(data, function(err, user){
			if(err){
				res.writeHead(500);
				res.end(err);
			} else {
				res.contentType('json');
			 	res.write(JSON.stringify({user: user}));
				res.end();
			}
		});
	});

	app.post('/file-upload/:id', function(req, res){
		
		console.log(req.params.id);
		var fileName = req.params.id + '.' + req.files.fileUpload.name.split('.').pop();
		var serverPath = '/images/users/' + req.params.id + '.png';//'/images/users/' + fileName;

		var fs = require('fs');

		//resize to 150px width

		fs.createReadStream(req.files.fileUpload.path).pipe(fs.createWriteStream('./public' + serverPath));

		res.contentType('json');
        res.write(JSON.stringify({path: serverPath}));
        res.end();	

		//updte the image_url
		/*User.updateUserByNick({image_url: fileName, nick: req.params.id }, function(err, data){
					
		});*/

		
	});

}