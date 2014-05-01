var mongoose = require('../modules/mongo').mongoose;
var Schema = mongoose.Schema;

var CategorieSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image_url: {
		type: String		
	},
	threads:{
		type: Number,
		'default': 0
	}
});

CategorieSchema.statics.getCategories = function(callback){
	this.find(function (err, categories){
		if(err) {
			callback(err);
		}
		else {
			callback(null, categories);
		}
	});
}

CategorieSchema.statics.getCategoriesById = function(category_id,callback){
	this.findOne({_id: category_id},function (err, category){
		if(err) {
			callback(err);
		}
		else {
			callback(null, category);
		}
	});
}

CategorieSchema.statics.incrementThread = function(thread_id, callback){
	this.update({
		_id:thread_id
	},
	{
		$inc: {threads:1}
	},
	{
		safe:true
	},
	function(err, docs){
		//console.log(err);	
		if(err){
			callback(err);
		} else {
			callback(null, docs);
		}
	});
}

CategorieSchema.statics.populateData = function (callback) {
	console.log('POPULATING DATA');
	//Validate the email


	var categories = [
	{
		name: "Zona Digital",
		description: "Ayuda con la compu, progamas nuevos, tecnología",
		image_url: "chrome.png"
	},
	{
		name: "Desclasificados",
		description: "Compro, vendo, regalo, cambio, parchesa",
		image_url: "newspaper.gif"
	},
	{
		name: "Zona Hot",
		description: "La sala de cupido, Afrodita y Venus",
		image_url: "meet_menu.png"

	},
	{
		name: "El Muro de las Lamentaciones ",
		description: "Lo que odiamos/queremos de nuestra amada patria…",
		image_url: "anarchy.png"

	},
	{
		name: "Humor!",
		description: "Pa que tiren caja",
		image_url: "lol.gif"

	},
	{
		name: "Sugerencias, Comentarios, Reportar errores",
		description: "Ayudanos a mejorar nuestra comunidad de desparchados",
		image_url: "mailbox.png"

	},
	{
		name: "Anuncios",
		description: "La sala d las revelaciones",
		image_url: "advert.png"

	},
	{
		name: "Dscusiones",
		description: "No te acomodas en ninguna Categoria?, Ahora es cuando",
		image_url: "forum.png"

	},
	{
		name: "Filosofia",
		description: "Pa q discutan todas las ñañas de filosofia q quiera",
		image_url: "philosophy.png"

	},
	{
		name: "La juegosfera",
		description: "Consolas, juegos on-line, PC-Games",
		image_url: "controller.gif"

	},
	{
		name: "Programacion, Bases d Datos, Diseño, WWW",
		description: "como!! quien dijo q jue, q como jueke q.... peguele",
		image_url: "php.png"

	},
	{
		name: "MusiK",
		description: "Comparti aquí tus gustos musicales...(Menos regueton)",
		image_url: "music.png"

	},
	{
		name: "Deportes",
		description: "Quien dijo futbol al reves(?)",
		image_url: "ball.png"

	}];

	for (var i in categories) {

		var instance = new Category({
			name: categories[i].name,
			description : categories[i].description,		
			image_url: categories[i].image_url
		});

		instance.save(function (err) {
	    	console.log(err);
	        console.log("SAVED");
	        console.log(instance);
	    });
	};

	callback("termino");

	/*
	var instance = new User({
		email: data.email,
		nick : data.nick,		
		password: hash(data.password, conf.secret) 
	});

	console.log(instance);

	instance.save(function (err) {
    	console.log(err);
        fn(err, instance);
    });*/
};


Category = mongoose.model('categories', CategorieSchema);

exports.Category = Category;