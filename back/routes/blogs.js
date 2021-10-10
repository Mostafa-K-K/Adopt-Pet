var express = require('express');
var router = express.Router();
var blogsController = require('../controllers/blogsController');

const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (res, file, cb) => {
        const { fieldname, originalname } = file;
        const date = Date.now();
        const filename = `img-${date}-${originalname}`;
        cb(null, filename)
    }
});

const upload = multer({ storage: multerStorage })

router.post('/blogs', upload.single('fileSrc'), blogsController.post);
router.put('/blogs/:id', upload.single('fileSrc'), blogsController.put);

router.get('/blogsuser/:_User', blogsController.getByUser);
router.post('/blogsfilter', blogsController.getFiltration);

router.get('/blogsAll', blogsController.getAll);

router.get('/blogs', blogsController.getAll);
router.get('/blogs/:id', blogsController.get);
router.delete('/blogs/:id', blogsController.delete);

module.exports = router;