var _thread;
window.ThreadView = Backbone.View.extend({	
	initialize: function(){
		//this.render();
		
		_thread = this;
		this.thread =  this.options.thread;
		this.getThread();	
		utils.websocket.on('updtComment',this.getLastComment);
	},
	render: function(){		

		var isLogged = (utils.session) ? true : false;
		var rendered_html = utils.render('ThreadView', {thread:this.threads, isLogged: isLogged});		


 		this.$el.html(rendered_html);
 		//this.$el.html(this.template());
        return this;	
	},
	events: {
		"submit #form-new": "sendComments"
	},
	title: '',
	getThread: function(){
		// /thread/:id
		utils.ajaxRequest({
            url: "/thread/" + _thread.thread,
            callback: function(err, data){            	
                if(!err) {            
                	console.log(data);            	
                	_thread.date = Date.now;                	
                	_thread.title = data.thread.title;
                	_thread.icon = data.thread.icon;                	
                    _thread.threads = data;                    
                    _thread.render();    
                    _thread.applywysi();                  
                }

                $('.ajax-loader').hide();
            },
            before: function(){
                $('.ajax-loader').show();
               // alert('cargando');
            }
        });
	},
	thread: '',
	threads: {},
	icon: '',
	sendComments: function(e){

		e.preventDefault();



		var isValid = $('#form-new').valid();

		if(isValid){

				var data = {
					comment: utils.linkifyYouTubeURLs($('#comment').val()),
					thread: _thread.thread,
					user: _thread.threads.thread.creator,//utils.getSession()._id,
					nick: utils.getSession().nick,
					title: _thread.title,
					icon: _thread.icon
				}							

				utils.ajaxRequest({
		            url: "/newcomment/",
		            type: "post",
		            data: data,
		            callback: function(err, data){		            	
		                if(!err) {                     
		                    //get the new comment      		                    
		                    var rendered_html = utils.render('CommentView', {i: data.thread});		                    
		                   	$("#div_comments").append(rendered_html);
		                    //$('#comment').val('');
		                    $('#comment').data("wysihtml5").editor.clear();
		                    _thread.lastComment = data.thread._id;
		                    utils.websocket.emit('newComment', {html:rendered_html, thread: _thread.thread, id: data.thread._id});
		                }

		                $('.ajax-loader').hide();
		            },
		            before: function(){
		                $('.ajax-loader').show();
		               // alert('cargando');
		            }
		        });
		}
	},
	validate: function(){
		$('#form-new').validate({
			rules: {
				"comment":{
					required: true
				}
			},
			messages: {
				"comment":{
					required: "El comentario es obligatorio"
				}
			},
			highlight: function(element){
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element.closest('.control-group').removeClass('error');
			}
		});
	},
	applywysi: function(){		
		$('#comment').wysihtml5();
	},
	date : '',
	getLastComment: function(comment){		
		if(comment.thread == _thread.thread && _thread.lastComment != comment.id){
			//$("#div_comments").append(comment.html);
			
			//var rendered_html = utils.render('CommentView', {i: comment.html});
			_thread.lastComment = '';
            $("#div_comments").append(comment.html);

		}		
	},
	lastComment:''
});