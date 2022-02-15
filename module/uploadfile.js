const util = require("util")
const multer = require('multer')
const Path = require('path')
const maxSize = 4 * 1024 * 1024;

let storage = multer.diskStorage({
    destination:Path.join(__dirname,'/public/images'), 
    filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() 
       + path.extname(file.originalname))
      // file.fieldname is name of the field (image)
      // path.extname get the uploaded file extension
}
})


let uploadFile = multer({
    storage:storage,
    limits:{fileSize:maxSize}
}).single("imageFiles");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware