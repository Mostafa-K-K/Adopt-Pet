const Blog = require('../models/Blog');
const Like = require('../models/Like');
const Request = require('../models/Request');

const fs = require('fs');

class BlogsController {

    getAll(req, res, next) {
        Blog
            .find({ available: true })
            .sort({ date: -1 })
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    getByUser(req, res, next) {
        let { _User } = req.params;
        Blog
            .find({ _User })
            .sort({ date: -1 })
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    getFiltration(req, res, next) {
        let { name } = req.body;
        Blog.find({
            $or: [
                { animal: { $regex: new RegExp(name) } },
                { kind: { $regex: new RegExp(name) } }
            ]
        }).populate('_User').exec((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    get(req, res, next) {
        let { id } = req.params;
        Blog.findById(id, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    post(req, res, next) {
        let body = req.body;
        body['photo'] = req.file && req.file.filename;

        let post = new Blog(body);
        post.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    put(req, res, next) {
        let { id } = req.params;
        let body = req.body;
        Blog.updateOne({ _id: id }, {
            $set: body
        }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    async delete(req, res, next) {
        let { id } = req.params;

        await Like.find({ _Blog: id }, (err, likes) => {
            if (err) return next(err);
            likes.map(async like => {
                await Like.deleteOne({ _id: like._id }, (err, response) => {
                    if (err) return next(err)
                });
            });
        });

        await Request.find({ _Blog: id }, (err, requests) => {
            if (err) return next(err);
            requests.map(async request => {
                await Request.deleteOne({ _id: request._id }, (err, response) => {
                    if (err) return next(err)
                });
            });
        });

        await Blog.findById(id, (err, data) => {
            if (err) return next(err);
            fs.unlink(`public/uploads/${data.photo}`, (err => {
                if (err) console.log(err);
                Blog.deleteOne({ _id: id }, (err, result) => {
                    if (err) return next(err);
                    res.json({ success: true, result });
                })
            }));
        });

    }

}

const blogsController = new BlogsController();
module.exports = blogsController;