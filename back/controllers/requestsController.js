const Request = require('../models/Request');
const Blog = require('../models/Blog');

class RequestsController {

    getAll(req, res, next) {
        Request
            .find({})
            .populate('_User')
            .populate('_Blog')
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    get(req, res, next) {
        let { id } = req.params;
        Request
            .findById(id, (err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    getByReceiver(req, res, next) {
        let { _Receiver } = req.params;
        let { status } = req.body;
        Request
            .find({ _Receiver, status })
            .populate('_Blog')
            .populate('_Sender')
            .populate('_Receiver')
            .exec((err, result) => {
                if (err) return next(err);
                console.log(result);
                res.json({ success: true, result });
            });
    }

    getBySender(req, res, next) {
        let { _Sender } = req.params;
        Request
            .find({ _Sender })
            .populate('_Blog')
            .populate('_Sender')
            .populate('_Receiver')
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    async post(req, res, next) {
        let { _User: _Sender, _Blog: _Blog } = req.body;
        let { _User: _Receiver } = await Blog.findById(_Blog);

        let request = new Request({ _Blog, _Sender, _Receiver });
        request.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    put(req, res, next) {
        let { id } = req.params;
        let body = req.body;
        Request
            .updateOne({ _id: id }, {
                $set: body
            }, (err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    delete(req, res, next) {
        let { id } = req.params;
        Request
            .deleteOne({ _id: id }, (err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

}

const requestsController = new RequestsController();
module.exports = requestsController;