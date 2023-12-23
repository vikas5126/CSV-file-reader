const mongoose = require('mongoose');
const multer = require('multer');

const path = require('path');
const FILE_PATH = path.join('/uploads/files');

const fileSchema = new mongoose.Schema(
    {
        filePath: {
            type: String,
        },
        originalName: {
            type: String,
        },
        file:{
            type:String,
        },
    },
    {
        timestamps: true,
    }
);

// setting for uploading file using multer 
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname,"..",FILE_PATH));
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "-" + Date.now());
    } 
})

// static function 
fileSchema.statics.uploadedFile = multer({storage: storage}).single('file');
fileSchema.statics.filePath = FILE_PATH;

const Files = mongoose.model("Files", fileSchema);

module.exports = Files;