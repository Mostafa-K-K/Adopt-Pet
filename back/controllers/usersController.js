const User = require('../models/User');
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

    delete(req, res, next) {
        let { id } = req.params;
        User.deleteOne({ _id: id }, (err, result) => {
            if (err) return next(err);
            res.json({ success: true, result });
        })
    }

}

const usersController = new UsersController();
module.exports = usersController;