var _category;
window.CategoryView = Backbone.View.extend({
	initialize: function(){
		_category = this;
		this.category =  this.options.category;
		this.getThreads();	
		//this.render();	
	},
	render: function(){
		
		//this.getThreads();
		var _new = (utils.session) ? true : false;

		var rendered_html = utils.render('CategoryView', {category: this.category, threads: this.threads, is_new : _new});		
        this.$el.html(rendered_html);
        //this.$el.html(this.template());
        return this;
	},
	getThreads: function(){
		utils.ajaxRequest({
            url: "/category/" + _category.category,
            callback: function(err, data){
                if(!err) {                             	
                	utils.icon = data.category;    
                    _category.threads = data;
                    _category.render();                      
                }

                $('.ajax-loader').hide();
            },
            before: function(){
                $('.ajax-loader').show();
               // alert('cargando');
            }
        });
	},
	category:'',
	threads: {}
});