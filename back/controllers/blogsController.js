const Blog = require('../models/Blog');
const fs = require('fs');

class BlogsController {

    getAll(req, res, next) {
        Blog.find({}).populate('_User').exec((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    getByUser(req, res, next) {
        let { _User } = req.params;
        Blog.find({ _User }).exec((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    getFiltration(req, res, next) {
        let { name } = req.body;
        Blog.find({ animal: { $regex: /^name/i } }).populate('_User').exec((err, result) => {
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
        console.log(req.file);
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

    delete(req, res, next) {
        let { id } = req.params;
        Blog.findById(id, (err, data) => {
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