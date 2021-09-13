const Blog = require('../models/Blog');

class BlogsController {

    getAll(req, res, next) {
        Blog.find({}).populate('_User').exec((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
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
        Blog.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

}

const blogsController = new BlogsController();
module.exports = blogsController;