const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log('1111111111111================')
        cb(null, 'images/')
    },
    filename(req, file, cb){
        console.log('222222222222================')
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

const types = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
    if(types.includes(file.mimetype)) {
        console.log('1111111111111================')
        cb(null, true)
    }
    else {
        console.log('222222222222================')
        cb(null, false)
    }
}

module.exports = multer(
    {storage, fileFilter})