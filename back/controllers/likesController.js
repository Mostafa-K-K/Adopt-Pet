const Like = require('../models/Like');

class LikesController {

    getAll(req, res, next) {
        Like.find({}, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    post(req, res, next) {
        let body = req.body;
        let post = new Like(body);
        post.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    delete(req, res, next) {
        let { id } = req.params;
        Like.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

}

const likesController = new LikesController();
module.exports = likesController;