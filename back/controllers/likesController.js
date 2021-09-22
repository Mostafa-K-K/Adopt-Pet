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
        let { _User, _Blog } = req.body;
        Like.find({ _User, _Blog }, (err, result) => {
            if (err) return next(err);
            if (result.length)
                Like.deleteOne({ _id: result[0]._id }, (err, result) => {
                    if (err) return next(err);
                    res.json({ success: true, result });
                })
        });
    }

}

const likesController = new LikesController();
module.exports = likesController;