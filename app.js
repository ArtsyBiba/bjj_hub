const express         = require('express'),
	  app             = express(),
	  bodyParser      = require('body-parser'),
	  mongoose        = require('mongoose'),
	  passport        = require('passport'),
	  flash           = require('connect-flash'),
	  LocalStrategy   = require('passport-local'),
	  Dojo   	      = require('./models/dojo'),
	  Comment         = require('./models/comment'),
	  User            = require('./models/user'),
	  methodOverride  = require('method-override'),
	  seedDB          = require('./seeds')

// Requiring routes
const commentRoutes = require('./routes/comments'),
	  dojoRoutes    = require('./routes/dojos'),
	  indexRoutes   = require('./routes/index')

//seedDB();
//mongoose.connect('mongodb://localhost:27017/bjj_hub', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://Artsy:AtsQjs4xbtvoTr8a@cluster0-g2reh.mongodb.net/<dbname>?retryWrites=true&w=majority', {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('connected to DB');
}).catch(err => {
	console.log('error:', err.message);
});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: 'BJJ will change your life',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/dojos/:id/comments', commentRoutes);
app.use('/dojos', dojoRoutes);

// app.listen(3000, function(){
//	console.log('BJJ Hub server has started');
//	});

app.listen(process.env.PORT, process.env.IP);