var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

mongoose.connect("mongodb+srv://aj_cody:aj1234@yelpcamp.rigns.gcp.mongodb.net/yelpcamp?retryWrites=true&w=majority")

// process.env.databaseURL

app.use(bodyParser.urlencoded({extended: true}));

//view engine - ejs
app.set("view engine", "ejs");

//styesheets
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//seed the database
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins the cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Setup server port
var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log("YelpCamp Server has started!")
});