var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function (req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err || !allCampgrounds) {
            req.flash("error", "Could not load campgrounds");
            res.redirect("back");
            console.log(err);
        } else {
            res.render("campgrounds/index",
                {
                    campgrounds: allCampgrounds,
                    page: "campgrounds"
                });
        }
    })
});

//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newCampground = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    //Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground created");
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(newCampground);
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW - show more info about a single campground
router.get("/:id", function (req, res) {
    //find the campground with provided  ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground details updated");
            //redirect somewhere (show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY - delete the campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground removed");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;