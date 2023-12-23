const Files = require("../models/file");
const csvParser = require("csv-parser");

// const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const file_path = path.join("/uploads/files");

// this is the home page 
module.exports.home = function(req, res){
    Files.find({}).then((files)=>{
        res.render("home", {
            title: "Home",
            files: files,
        });
    }).catch((err)=>{
        console.log("err in showing files", err);
        return res.redirect('/')
    })
}

// this is submit controller 
module.exports.submit = async function(req, res){
    try{
        // this is for upload file locally 
        Files.uploadedFile(req, res, function(err){
            if(err){
                console.log("multer Error", err);
            }
            console.log(req.file);
            // this is for filter for csv files 
            if((req.file && req.file.mimetype == "text/csv") || (req.file && req.file.mimetype == "application/vnd.ms-excel")){
                Files.create({
                    filePath: req.file.path,
                    originalName: req.file.originalname,
                    file: req.file.filename
                }).then(()=>{
                    
                    return res.redirect("/");
                }).catch((err)=>{
                    if(err){
                        console.log(err);
                        return res.status.json({message: "Error in creating Note or Uploading file"})
                    }
                })
            }
            else{
                console.log("Please Upload CSV Format file");
                // window.alert("Please Upload CSV Format file");
                return res.redirect("/");
            }
        })
    }catch(err){
        console.log(err);
    }
}


// this is for the showing the csv file 
module.exports.show = async function(req, res){
    try{
        let csvFile = await Files.findById(req.query.file_id);
        console.log(req.query.file_id);
        const results = [];
        const header = [];
        // we are using fs.createReadStream because in this you change separately 
        // like in header we want dynamic so we firstly we create that 
        fs.createReadStream(csvFile.filePath)
        .pipe(csvParser())
        .on('headers', (headers) =>{
            headers.map((head) => {
                header.push(head);
            });
            console.log("header => ", header);
        })
        .on('data', (data) => results.push(data))
        .on('end', () =>{
            console.log(results.length);
            let page = req.query.page;
            console.log("page => ", req.query.page);
            
            // this is for showing 100 entry every page 
            let startSlice = (page - 1) * 100 + 1;
            let endSlice = page*100;
            let sliceResults = [];
            let totalPages = Math.ceil(results.length/100);
            let next = parseInt(page)+1;
            let previous = parseInt(page) - 1;
            if(page <= 1){
                page = 1;
                previous = page;
            }else if(page >= totalPages){
                page = totalPages;
                next = totalPages
            }
            if(endSlice < results.length){
                sliceResults = results.slice(startSlice, endSlice+1);
            }
            else{
                sliceResults = results.slice(startSlice)
            }
            res.render("view", {
                title: csvFile.originalName,
                head: header,
                data: sliceResults,
                length: results.length,
                page: page,
                totalPages: totalPages,
                nextPage: next,
                previousPage: previous,
                id: req.query.file_id,
            })
        })
    }catch(err){
        console.log("Error in showing files", err);
    }
}

// this is for delete the files 
module.exports.delete = async function (req, res){
    const uploadFolder = path.join(__dirname,"..",file_path);
    const filename = req.params.id;
    console.log(filename)
    const pathtodelete = path.join(uploadFolder, filename);

    // and this is for delete file locally 
    if(fs.existsSync(pathtodelete)){
        fs.unlink(pathtodelete, (err)=>{
            if(err){
                console.error('Error deleting file:', err);
            }
            else{
                console.log('file deleted successfully');
            }
        });
    }
    else{
        console.log('file not found');
    }


    let obj = await Files.findOneAndDelete({file : req.params.id});
    return res.redirect('/');
}