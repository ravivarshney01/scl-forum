const postModel = require('../models/posts');
const userModel = require('../models/users')
const fs = require("fs");

module.exports = {
    create: function (req, res, next) {
        // console.log(req.body);
        // console.log(req.file.path);
        var k = new postModel();
        k.username = req.body.username;
        k.content = req.body.content;
        k.title = req.body.title;
        k.posted_on = Date.now();
        k.save().then((r, err) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    message: "Error!!!"
                });
            } else {
                return res.json({
                    error: false,
                    message: "Post added successfully",
                    data: k
                });
            }
        });
    },

    getById: function (req, res, next) {
        postModel.findById(req.params.post_id, function (err, postInfo) {
            if (err || postInfo == null) {
                return res.status(400).json({
                    error: true,
                    message: "Post not found!"
                })
            } else {
                res.json({
                    error: false,
                    message: "Post found.",
                    data: postInfo
                });
            }
        });
    },

    getAll: function (req, res, next) {
        let postsList = [];
        postModel.find({}).sort({ posted_on: -1 }).exec((er, posts) => {
            if (er || posts == null) {
                return res.status(400).json({
                    error: true,
                    message: "Posts not found!"
                })
            }
            else {
                for (let post of posts) {
                    postsList.push({ id: post._id, username: post.username, title: post.title, content: post.content, comments: post.comments, likes: post.likes, posted_on: post.posted_on })
                }
                res.json({
                    error: false,
                    message: "Post found.",
                    data: postsList
                });
            }
        })
    },

    getMyPosts: function (req, res, next) {
        let postsList = [];
        userModel.findOne({ username: req.params.username }, (er, r) => {
            if (er || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "User not found"
                });
            }
            else {
                postModel.find({}).sort({ posted_on: -1 }).exec((err, posts) => {
                    if (err) {
                        return res.status(400).json({
                            error: true,
                            message: "Error getting posts"
                        })
                    }
                    else {
                        for (let post of posts) {
                            if (post.username == req.params.username) {
                                postsList.push({ id: post._id, username: post.username, title: post.title, content: post.content, comments: post.comments, likes: post.likes, posted_on: post.posted_on })
                            }
                        }
                        res.json({
                            error: false,
                            message: "Post found.",
                            data: postsList
                        });
                    }
                })
            }
        })
    },
    getMyFeed: function (req, res, next) {
        let postsList = [];
        let validUsers = [];
        userModel.findById(req.body.userId, (err, r) => {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "User not found!"
                });
            } else {
                validUsers = Array.from(r.following);
                validUsers.push(r.username);

                postModel.find({}).sort({ posted_on: -1 }).exec((er, posts) => {
                    if (er) {
                        return res.status(400).json({
                            error: true,
                            message: "Posts not found!"
                        })
                    }
                    else {
                        for (let post of posts) {
                            if (validUsers.includes(post.username)) {
                                postsList.push({ id: post._id, username: post.username, title: post.title, content: post.content, comments: post.comments, likes: post.likes, posted_on: post.posted_on })
                            }
                        }
                        res.json({
                            error: false,
                            message: "Post found.",
                            data: postsList
                        });
                    }
                })

            }
        })
    },

    deletePost: function (req, res, next) {
        postModel.findByIdAndRemove(req.params.post_id, function (err, r) {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "Post not found!"
                })
            } else {
                res.json({
                    error: false,
                    message: "Post deleted successfully."
                })
            }
        })
    },

    updatePost: function (req, res, next) {
        postModel.findByIdAndUpdate(req.body.post_id, { $set: { content: req.body.content } }, { new: true }, function (err, r) {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "Post not found"
                });
            } else {
                res.json({
                    error: false,
                    message: "Post updated",
                    data: r
                });
            }
        })
    },

    addNewComment: function (req, res, next) {
        let comment = {}
        comment.postedBy = req.body.username;
        comment.content = req.body.content;
        postModel.findByIdAndUpdate(req.body.post_id, { $push: { comments: comment } }, { new: true }, function (err, post) {
            if (err || post == null) {
                return res.status(400).json({
                    error: true,
                    message: "Error fetching post's details"
                });
            } else {
                res.json({
                    error: false,
                    message: "Comment added.",
                    data: post
                });
            }
        })
    },

    deleteComment: function (req, res, next) {
        postModel.findOneAndUpdate(req.body.post_id, { $pull: { comments: { _id: req.body.id } } }, { new: true }, (err, r) => {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "Error fetching post"
                });
            }
            else {
                res.json({
                    error: false,
                    message: "Comment deleted.",
                    data: r
                });
            }
        })
    },

    like: function (req, res, next) {
        let n = []
        postModel.findById(req.body.post_id, (err, r) => {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "Error getting post!"
                })
            }
            else {
                n = Array.from(r.likes)
                n.push(req.body.username)
                let s = new Set(n)
                n = Array.from(s)
                postModel.findByIdAndUpdate(req.body.post_id, { $set: { likes: n } }, function (e, p) {
                    if (e) {
                        return res.status(400).json({
                            error: true,
                            message: "Error getting post!"
                        });
                    } else {
                        res.json({
                            error: false,
                            message: "Post liked.",
                            likes: n
                        });
                    }
                })
            }
        });
    },

    unlike: function (req, res, next) {
        let n = []
        postModel.findById(req.body.post_id, (err, r) => {
            if (err || r == null) {
                return res.status(400).json({
                    error: true,
                    message: "Post not found"
                })
            }
            n = Array.from(r.likes)
            n = n.filter(function (e) {
                return e != req.body.username
            })
            postModel.findByIdAndUpdate(req.body.post_id, { $set: { likes: n } }, function (e, p) {
                if (e || p == null) {
                    return res.status(400).json({
                        error: true,
                        message: "Post not found!"
                    });
                } else {
                    res.json({
                        error: false,
                        message: "Post liked.",
                        likes: n
                    });
                }
            })
        })
    }
}