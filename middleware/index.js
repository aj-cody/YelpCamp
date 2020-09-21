var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    //all middleware goes here
    middlewareObj = {
        checkCampgroundOwnership: function (req, res, next) {
            //is user logged in
            if (req.isAuthenticated()) {
                Campground.findById(req.params.id, function (err, foundCampground) {
                    if (err || !foundCampground) {
                        req.flash("error", "Campground not found");
                        res.redirect("back");
                    } else {
                        //does user own the campground?
                        if (foundCampground.author.id.equals(req.user._id)) {
                            next();
                        } else {
                            req.flash("error", "You don't have the permission to do that");
                            //otherwise, redirect
                            res.redirect("back");
                        }
                    }
                });
            } else {
                //if not, redirect
                req.flash("error", "You need to be logged in!");
                res.redirect("back");
            }
        },

        checkCommentOwnership: function (req, res, next) {
            //is user logged in
            if (req.isAuthenticated()) {
                Comment.findById(req.params.comment_id, function (err, foundComment) {
                    if (err || !foundComment) {
                        req.flash("error", "Comment not found");
                        res.redirect("back");
                    } else {
                        //does user own the comment?
                        if (foundComment.author.id.equals(req.user._id)) {
                            next();
                        } else {
                            req.flash("error", "You don't have permission to do that");
                            //otherwise, redirect
                            res.redirect("back");
                        }
                    }
                });
            } else {
                req.flash("error", "You need to be logged in to do that");
                //if not, redirect
                res.redirect("back");
            }
        },

        isLoggedIn: function (req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            req.flash("error", "You need to be logged in!");
            res.redirect("/login");
        }
    };

module.exports = middlewareObj;