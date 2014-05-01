var _home;
window.HomeView = Backbone.View.extend({	
    initialize:function () {
    	_home = this;    	
        this.getCategories();       
    },
    render:function () {
        var data = {
            categories: this.categories,
            newsThreads: this.newsThreads,
            newsComments: this.newsComments
        }

       
        var rendered_html = utils.render('HomeView', {info: data});        
        this.$el.html(rendered_html);        
        return this;
    },
    getCategories: function(){
        //get the categories
        utils.ajaxRequest({
            url: "/categories",
            callback: function(err, categories){
                if(!err){     

                    //get the news comments
                    utils.ajaxRequest({
                        url: "/homethreads/comment",
                        callback: function(err, data){
                            if(!err){                     
                                _home.newsComments = data.news;

                                //get the threads news
                                utils.ajaxRequest({
                                    url: "/homethreads/thread",
                                    callback: function(err, data){
                                        if(!err){                                                                 
                                           // var nada = '<li><img src="/images/categories/chrome.png"><a href="/#/tema/id">Miren que mierda de gif jajaja</a></li>';
                                            _home.newsThreads = data.news;

                                            _home.categories = categories;                    
                                            _home.render();
                                           
                                        }
                                        
                                        $('.ajax-loader').hide();
                                    },
                                    before: function(){
                                        $('.ajax-loader').show();               
                                    }
                                });
                            }
                                       
                            $('.ajax-loader').hide();
                        },
                        before: function(){
                            $('.ajax-loader').show();               
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
    },
    getNews: function(){


        
    },
    categories: {},
    newsComments: {},
    newsThreads: {}
});