require('dotenv').config();

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
	  seedDB          = require('./seeds'),
	  session         = require('express-session'),
	  MongoStore      = require('connect-mongo')(session)


// Requiring routes
const commentRoutes = require('./routes/comments'),
	  dojoRoutes    = require('./routes/dojos'),
	  indexRoutes   = require('./routes/index')

//seedDB();
let url = process.env.DATABASEURL || 'mongodb://localhost:27017/bjj_hub';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');


// app.use(require("express-session")({
// 	secret: 'BJJ will change your life',
// 	resave: false,
// 	saveUninitialized: false
// }));
// PASSPORT CONFIG
app.use(session({
    secret: 'BJJ will change your life',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 } // 180 minutes session expiration
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

let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});