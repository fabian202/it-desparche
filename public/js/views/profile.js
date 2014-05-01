var _profile;
window.ProfileView = Backbone.View.extend({
	initialize: function(){
		_profile = this;
		this.nick = this.options.nick;
		this.getProfile();
	},
	render: function(){			
		var edit = (this.nick == utils.session.nick) ? true : false;
		var rendered_html = utils.render('ProfileView', {profile: this.profile, edit: edit, comments: this.comments, threads: this.threads});		
        this.$el.html(rendered_html);        
        return this;
	},
	events: {
    	"submit #uploadForm":"uploadPicture",
        "change #fileUpload":"changePicture",
        "click #image-user,  #btn-upload":"imageUser",
        "click #cancel-upload": "cancelUpload"
	},
	getProfile: function(){
		utils.ajaxRequest({
            url: "/perfil/" + _profile.nick,
            callback: function(err, data){    

            	if(!err){
            		utils.ajaxRequest({
			            url: "/homethreads/" + _profile.nick + "/comment",
			            callback: function(err, comments){    
			            	 
			                if(!err) { 

								utils.ajaxRequest({
						            url: "/homethreads/" + _profile.nick + "/thread",
						            callback: function(err, threads){    
						            	 
						                if(!err) {                        	                	                              	
						                    _profile.profile = data.user; 
						                    _profile.threads = threads;
						                    _profile.comments = comments;                   
						                    _profile.render();                        
						                }

						                $('.ajax-loader').hide();
						            },
						            before: function(){
						                $('.ajax-loader').show();
						               // alert('cargando');
						            }
						        });			                                     
			                }

			                $('.ajax-loader').hide();
			            },
			            before: function(){
			                $('.ajax-loader').show();
			               // alert('cargando');
			            }
			        });
            	}

            	
            	 
                if(!err) {                        	                	                              	
                    _profile.profile = data.user;                    
                    _profile.render();                        
                }

                $('.ajax-loader').hide();
            },
            before: function(){
                $('.ajax-loader').show();
               // alert('cargando');
            }
        });


		//this.render();
	},
	nick: '',
	profile: {},
	comments: {},
	threads: {},
	cancelUpload: function(){        
        $('#uploadedImage').attr({src: this.last_image});
        $('#accept-upload').toggle();
        this.edit_image = false;
    },
    imageUser: function(){
        $('#fileUpload').click();
    },
    changePicture: function(event){
       
        var files = event.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

          // Only process image files.
          if (!f.type.match('image.*')) {
            continue;
          }
          //Validate image size
          if(Math.round(f.size / 1000) > 500){
          	bootbox.alert('El tamaño maximo de la imagen son 500 kb');
          	continue;
          }

          var reader = new FileReader();

          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              // Render thumbnail.
              if(!_profile.edit_image) {
                _profile.last_image = $('#uploadedImage').attr('src');
                $('#accept-upload').toggle();                
              }

              $('#uploadedImage').attr({src: e.target.result});              
              
              _profile.edit_image = true;
            };
          })(f);

          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
        }
    },
    uploadPicture: function(e){
        e.preventDefault();

        var formData = new FormData($('#uploadForm')[0]);
        
        var fileSize = 

        $.ajax({
            url: '/file-upload/' + utils.session.nick,  //server script to process data
            type: 'POST',
            xhr: function() {  // custom xhr
                myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // check if upload property exists
                    //myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
                }
                return myXhr;
            },
            //Ajax events
            beforeSend: function(){
                //show animation
                $('#loader-upload').toggle();
            },
            success: function(response){
                //$('#uploadedImage').attr('src', response.path);
                $('#accept-upload').toggle();
                _profile.edit_image = false;
                $('#loader-upload').toggle();
            },
            error: function(err){

            },
            // Form data
            data: formData,
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        });
    },
    last_image: '',
    edit_image: false,
});