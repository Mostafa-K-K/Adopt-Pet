const User = require('../models/User');
const Like = require('../models/Like');
const Blog = require('../models/Blog');
const Request = require('../models/Request');

const fs = require('fs');
const bcrypt = require("bcryptjs");

class UsersController {

    isValidUsername(req, res, next) {
        let { username } = req.body;
        User.findOne({ username }, 'username', (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    isValidPhone(req, res, next) {
        let { phone } = req.body;
        User.findOne({ phone }, 'phone', (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    getAll(req, res, next) {
        User.find({}, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

    get(req, res, next) {
        let { id } = req.params;
        User.findById(id, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    async put(req, res, next) {
        let { id } = req.params;
        let body = req.body;

        if (body.password) {
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(body['password'], salt);
            body['password'] = hashedPassword;
        }

        User.updateOne({ _id: id }, {
            $set: body
        }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });
    }

    async delete(req, res, next) {
        let { id } = req.params;

        await Like.find({ _User: id }, (err, likes) => {
            if (err) return next(err);
            if (likes.length)
                likes.map(async like => {
                    await Like.deleteOne({ _id: like._id }, (err, response) => {
                        if (err) return next(err)
                    });
                });
        });

        await Request.find({
            $or: [
                { _Sender: id },
                { _Receiver: id }
            ]
        }, (err, requests) => {
            if (err) return next(err);
            if (requests.length)
                requests.map(async request => {
                    await Request.deleteOne({ _id: request._id }, (err, response) => {
                        if (err) return next(err)
                    });
                });
        });

        await Blog.find({ _User: id }, (err, blogs) => {
            if (err) return next(err);

            if (blogs.length)

                blogs.map(async blog => {
                    await Like.find({ _Blog: blog._id }, (err, likes) => {
                        if (err) return next(err);
                        likes.map(async like => {
                            await Like.deleteOne({ _id: like._id }, (err, response) => {
                                if (err) return next(err)
                            });
                        });
                    });

                    fs.unlink(`public/uploads/${blog.photo}`, (async err => {
                        if (err) console.log(err);
                        await Blog.deleteOne({ _id: blog._id }, (err, result) => {
                            if (err) return next(err);
                        })
                    }));
                });
        });

        await User.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        });

    }

}

const usersController = new UsersController();
module.exports = usersController;