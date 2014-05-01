
var AppRouter = Backbone.Router.extend({
	routes: {
		"":"home",
		"registro/:optn":"registerOpt",
		"logout": "logout",
		"categoria/:optn":"categorias",
		"categoria/:optn/new":"newCategorias",
		"tema/:id":"thread",
		"chat":"chatd",
		"user/:nick":"profile"
	},
	initialize: function () {		
		var retrievedObject = localStorage.getItem('user');		
		if(retrievedObject) utils.session = JSON.parse(retrievedObject);		
		if(!this.headerView)
        	this.headerView = new HeaderView();
        $('#header').html(this.headerView.el);
        this.headerView.toggleForm();        
        utils.websocket = io.connect();        
    },
	home: function(){		
        var homeView = new HomeView();        
        $('#content').html(homeView.el);        
        //var homeView = new HomeView();
        //$('#content').html(homeView.el);
	},
	registerOpt: function(opt){
		this.reg();		
		$('#login-tabs a[href="#' + opt + '"]').tab('show');
	},
	reg: function(){
		var registerVIew = new RegisterView();
		$('#content').html(registerVIew.el);		
		registerVIew.validate();
	},
	logout: function(){		
		localStorage.removeItem('user');
		utils.session = null;
		this.headerView.toggleForm();
		location.href = "/#";
	},
	newCategorias: function(optn){
		var newCategory = new NewCategoryView({category: optn});
		$('#content').html(newCategory.el);
		newCategory.applywysi();
		newCategory.validate();
	},
	categorias: function(optn){
		var categoryView = new CategoryView({category: optn});
		$('#content').html(categoryView.el);
	},
	thread: function(id){
		var treadView = new ThreadView({thread: id});
		$('#content').html(treadView.el);
		treadView.applywysi();
		treadView.validate();

	},
	profile: function(nick){
		var profileView = new ProfileView({nick: nick});
		$('#content').html(profileView.el);
	},
	chatd: function(){
		var chatView = new ChatView();
		$('#content').html(chatView.el);
	}
});

app = new AppRouter();
Backbone.history.start();