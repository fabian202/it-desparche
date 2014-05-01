var _header;
window.HeaderView = Backbone.View.extend({
    initialize:function () {
    	_header = this;
    	this.render();
    },
    render:function () { 
        var isLogged = (utils.session) ? true : false;
        var rendered_html;
        
        rendered_html = utils.render('HeaderView', {});

        
        this.$el.html(rendered_html);
        //this.$el.html(this.template());
        return this;
    },
    events:{        
    	"submit #frm-login":"loginForm",
        "submit #frm-register": "register"
    },
    test: function(e){
        alert("click");
    },
    loginForm: function(e){        
    	e.preventDefault();

    	data = {
			email:$('#email').val(),
			password:$('#password').val()
		}

		utils.ajaxRequest({
            url: "/login",
            data: data,
            type: "post",
            callback: function(err, user){
                if(!err){ 
                    $('#modalLogin').modal('hide');                     
                    localStorage.setItem('user', JSON.stringify(user));
					var retrievedObject = localStorage.getItem('user');				
					utils.session = JSON.parse(retrievedObject);	
					_header.toggleForm();
                                      
                } else {
                	bootbox.alert(err.responseText);
                }
               
               // alert('cargo');
                $('.ajax-loader').hide();
            },
            before: function(){
                $('.ajax-loader').show();
               // alert('cargando');
            }
        });
    },
    toggleForm: function(){        
    	if(utils.session){
	    	var tpl = utils.render('UserView', {nick: utils.session.nick,full_name: utils.session.nick });//_.template($('#user-template').html());
			$("#frm-login").remove();
			var full_name = utils.session.nick;
            $("#panel-login").html(tpl);
			//$("#panel-login").html(tpl({name: utils.session.first_name,full_name: full_name }));
    	} else {
    		var tpl = utils.render('LoginView', {});//_.template($('#login-template').html());
			$("#ddl-user").remove();			
            $("#panel-login").html(tpl);
			//$("#panel-login").html(tpl());
    	}    	

    },
    register: function(e){
        e.preventDefault();

        var isValid = $('#frm-register').valid();

        if(isValid){
            data = { 
                email : $('#reg-email').val(), 
                first_name : $('#first_name').val(), 
                last_name : $('#last_name').val(), 
                password : $('#reg-password').val()
            }
            

            ajaxPost(data,'/registro', function(err, res){
                if(err == null){
                    //user registered
                    bootbox.alert('Registro completado con exito, ahora puedes iniciar sesión', function() {
                        $('#login-tabs a[href="#login"]').tab('show');
                    });
                }
            }, 'post');
        }
    },
    fireworks: function(){
        //Xteam.fireworkShow('#div-title', 500);   
    }
});