const Report = require('../models/Report');
const Blog = require('../models/Blog');
const User = require('../models/User');

class ReportsController {

    getAll(req, res, next) {
        Report
            .find({})
            .populate('_Reporter', 'username')
            .populate('_Reported', 'username')
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    getByReported(req, res, next) {
        let { _Reported } = req.body;
        Report
            .find({ _Reported })
            .populate('_Reporter', 'username')
            .populate('_Reported', 'username')
            .populate('_Blog')
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    getByReporter(req, res, next) {
        let { _Reporter } = req.body;
        Report
            .find({ _Reporter })
            .populate('_Reporter', 'username')
            .populate('_Reported', 'username')
            .exec((err, result) => {
                if (err) return next(err);
                res.json({ success: true, result });
            });
    }

    async post(req, res, next) {
        let { _User: _Reporter, _Blog, description } = req.body;
        let { _User: _Reported } = await Blog.findById(_Blog);

        let report = new Report({ _Reporter, _Blog, _Reported, description });
        report.save((err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    getReportsCount(req, res, next) {
        let arr = [];
        let count = 1;
        User
            .find({ role_id: "user" }, ["username"], (err, response) => {
                if (err) return next(err);
                response.map(respo => {
                    Report.find({ _Reported: respo._id }, (err, data) => {
                        let sum = 0;
                        if (data.length) {
                            sum = data.length;
                            arr.push({ ...respo._doc, count: sum });
                        }
                        if (count == response.length) {
                            res.json({ success: true, result: arr });
                        } else {
                            count++;
                        }
                    });
                });
            });
    }

    delete(req, res, next) {
        let { id } = req.params;
        Report
            .deleteOne({ _id: id }, (err, result) => {
                if (err) return next(err)
                res.json({ success: true, result });
            });
    }

}

const reportsController = new ReportsController();
module.exports = reportsController;