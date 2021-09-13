const Request = require('../models/Request');

class RequestsController {

    getAll(req, res, next) {
        Request.find({}).populate('_User').populate('_Blog').exec((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    get(req, res, next) {
        let { id } = req.params;
        Request.findById(id, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    post(req, res, next) {
        let body = req.body;
        let post = new Request(body);
        post.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    put(req, res, next) {
        let { id } = req.params;
        let body = req.body;
        Request.updateOne({ _id: id }, {
            $set: body
        }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    delete(req, res, next) {
        let { id } = req.params;
        Request.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

}

const requestsController = new RequestsController();
module.exports = requestsController;