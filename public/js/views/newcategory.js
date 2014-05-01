var _newcategory;
window.NewCategoryView = Backbone.View.extend({
	initialize: function(){
		_newcategory = this;
		this.render();
	},
	render: function(){
		var rendered_html = utils.render('NewCategoryView', {category: this.options.category});
        this.$el.html(rendered_html);
        //this.$el.html(this.template());
        return this;
	},
	applywysi: function(){
		$('#post_desc').wysihtml5();
	},
	events: {
		"submit #form-new": "newPost"
	},
	newPost: function(e){
		e.preventDefault();

		var isValid = $('#form-new').valid();

		if(isValid){			
			var data = {
				title: $("#post_title").val(),
				description: utils.linkifyYouTubeURLs($("#post_desc").val()),
				user: utils.getSession().nick,	
				category:$("#category").val(),
				icon: utils.icon
			};		

			utils.ajaxRequest({
	            url: "/tema",
	            data: data,
	            type: "post",
	            callback: function(err, thread){
	                if(!err){                     	                	

	                	bootbox.alert("Desparchado su tema fue creado!!", function() {
							location.href = "/#/tema/" + thread.response._id;
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
		$('#form-new').validate({
			rules: {
				"post_title":{
					required: true
				},
				"post_desc":{
					required: true
				}
			},
			messages: {
				"post_title":{
					required: "El titulo es obligatorio"
				},
				"post_desc":{
					required: "La descripción es obligatoria"
				}
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