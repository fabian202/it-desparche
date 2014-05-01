
window.RegisterView = Backbone.View.extend({	
	initialize: function(){
		this.render();
	},
	render: function(){		
 		this.$el.html(utils.render('RegisterView', {}));
 		//this.$el.html(this.template());
        return this;	
	},
	events:{
		"submit #frm-register":"register",
		"submit #form-login": "login"
	},
	login: function(e){
		e.preventDefault();
		var isValid = $('#form-login').valid();

		if(isValid){
			
			data = {
				email:$('#login-email').val(),
				password:$('#login-password').val()
			}

			utils.ajaxRequest({
	            url: "/login",
	            data: data,
	            type: "post",
	            callback: function(err, user){
	                if(!err){                     

	                	utils.setSession(user);                
						location.href = "/";
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
		}
	},
	register: function(e){
		e.preventDefault();

		var isValid = $('#frm-register').valid();

		if(isValid){
			data = { 
				email : $('#reg-email').val(), 
				nick : $('#nick').val(), 				
				password : $('#reg-password').val()
			}

			utils.ajaxRequest({
	            url: "/register",
	            data: data,
	            type: "post",
	            callback: function(err, user){
	                if(!err){                     
	                    //user registered
						bootbox.alert('Registro completado con exito, ahora puedes iniciar sesión', function() {
							$('#login-tabs a[href="#login"]').tab('show');
						});
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
		}
	},
	validate: function(){
		$('#frm-register').validate({
			rules: {
				"first_name":{
					required: true
				},
				"last_name":{
					required: true
				},
				"reg-email":{
					required: true,
					email: true,
					remote : {
						url: "/check_email",
						async: false
					}
				},
				"reg-password": {
					required: true
				},
				"rpassword": {
					required: true,
					equalTo: "#reg-password"
				},
				"terms": "required"
			},
			messages: {
				"first_name":{
					required: "El nombre es obligatorio"
				},
				"last_name":{
					required: "El apellido es obligatorio"
				},
				"reg-email":{
					required: "El email es obligatorio",
					email: "Email incorrecto",
					remote: "El email ya esta en uso"		
				},
				"reg-password": {
					required: "Ingrese el password"
				},
				"rpassword": {
					required: "Ingrese de nuevo el password",
					equalTo: "Los password son diferentes"
				},
				"terms": "Por favor acepte los terminos y condiciones"
			},
			highlight: function(element){
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element.closest('.control-group').removeClass('error');
			}
		});

		$('#form-login').validate({
			rules : {
				"login-email": {
					required: true,
					email: true
				},
				"login-password": {
					required: true
				}
			},
			messages : {
				"login-email": {
					required : "El correo es requerido",
					email: "Email incorrecto"
				},
				"login-password": "El password es requerido"
			},
			highlight: function(element){
				$(element).closest('.control-group').removeClass('success').addClass('error');
			},
			success: function(element) {
				element.closest('.control-group').removeClass('error');
			}
			
		});
	}
});