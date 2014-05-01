var _chat;
window.ChatView = Backbone.View.extend({
	initialize: function(){
		_chat = this;
		this.render();
		utils.websocket.on('chatComment',this.getLastComment);
	},
	render: function(){
		var _logged = (utils.session) ? true : false;

		var rendered_html;
		if(_logged)
			rendered_html = utils.render('ChatView', {});		
		else
			rendered_html = "<h2>Debes iniciar sesión o registrarte</h2>";
        this.$el.html(rendered_html);
        //this.$el.html(this.template());
        return this;
	},
	events: {
		"submit #form-chat":"sendComment"
	},
	getLastComment : function(comment){
		if(comment.user != utils.getSession().nick){			
			$("#chat-container").append(comment.html);  
			_chat.scrollBottom(); 
		}
	},
	sendComment: function(e){
		e.preventDefault();
		var comment = {
			user: utils.getSession().nick,
			comment: $('#comment').val(),
			comments: []
		}	

		var rendered_html = utils.render('CommentView', {i: comment});		    

       	$("#chat-container").append(rendered_html);        
        $('#comment').val('');
        this.scrollBottom();        
        utils.websocket.emit('newChatComment', {html:rendered_html, user: comment.user, date: Date.now});
	},
	scrollBottom: function(){		                    
        var $t = $("#chat-container");
        //$t.html($t.html() + ' World! Hello World! Hello World! Hello World! Hello World! Hello World!');
        $t.animate({"scrollTop": $('#chat-container')[0].scrollHeight}, "slow");                    
	}
});