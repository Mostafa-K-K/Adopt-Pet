const Statut = require('../models/Statut');

class StatusController {

    getAll(req, res, next) {
        Statut.find({}, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    get(req, res, next) {
        let { id } = req.params;
        Statut.findById(id, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    post(req, res, next) {
        let body = req.body;
        let post = new Statut(body);
        post.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    put(req, res, next) {
        let { id } = req.params;
        let body = req.body;
        Statut.updateOne({ _id: id }, {
            $set: body
        }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    delete(req, res, next) {
        let { id } = req.params;
        Statut.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

}

const statusController = new StatusController();
module.exports = statusController;