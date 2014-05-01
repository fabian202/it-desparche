window.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {

                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },
    ajaxRequest: function (options){

        var defaults = { type:"get", data: "", url:"", before: function(){} };
        //var options = { validate: true, name: "bar" };
        /* merge defaults and options, without modifying defaults */
        var settings = $.extend({}, defaults, options);

        $.ajax({
            url: settings.url,
            data: settings.data,
            type : settings.type,
            dataType: 'json',
            cache: false,
            beforeSend: function(){
                settings.before();
            },         
            complete: function(){
                //Hide animation                    
            },
            success: function(data) {
                //Show Message                
                settings.callback(null, data);
            },
            error: function(e,b) {
                //Show Message                
                settings.callback(e);
            }
        });
    },
    session: null,
    setSession: function(session_obj){

        var defaults = this.session;
        //var options = { validate: true, name: "bar" };
        /* merge defaults and options, without modifying defaults */
        var settings = $.extend({}, defaults, session_obj);

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(settings));
        
        this.session = settings;
    },
    getSession: function(){

    	var retrievedObject = localStorage.getItem('user');		
		if(retrievedObject) retrievedObject = JSON.parse(retrievedObject);
		this.session = retrievedObject;
		return retrievedObject;
    },
    render : function(tmpl_name, tmpl_data) {        
        if ( !this.tmpl_cache ) { 
            this.tmpl_cache = {};
        }

        if ( ! this.tmpl_cache[tmpl_name] ) {            
            var tmpl_dir = '/tpl';
            var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

            var tmpl_string;
            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                success: function(data) {
                    tmpl_string = data;
                     $('.ajax-loader').hide();
                },
                beforeSend: function(){
                     $('.ajax-loader').show();
                },  
            });

            this.tmpl_cache[tmpl_name] = _.template(tmpl_string);
        }    

        return this.tmpl_cache[tmpl_name](tmpl_data);
    },
    tmpl_cache: {},
     // Linkify youtube URLs which are not already links.
    linkifyYouTubeURLs: function(text) {

        var re = /(<a[^>]+href="https?:\/\/www.youtube.com(?:[0-9A-Z-]+\.)?(.*?)>(.*?)<\/a>)/g;
        var rex = /v[\/=]?\b[\w_-]+\b/g;
        //var full_link = text.match(re)[0];
        if(text.match(re)){
             _.each(text.match(re), function(i){                
                
                var match = i.match(rex);
                if(match && match[0]) {
                    match[0] = match[0].replace('v=','');

                    text = text.replace(i, utils.embebed_youtube(match[0]));
                }        
            });  
        }                     

        return text;        
    },
    embebed_youtube: function(id){
      return '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>';
    },
    icon: '',
    websocket:null

};