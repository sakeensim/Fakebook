
const path = require('path')
const fs = require('fs/promises')
const tryCatch =require('../utils/tryCatch')
const cloudinary =require('../config/cloudinary')
const prisma = require('../models')



module.exports.createPost = tryCatch (async (req, res) =>{
    
    //เรียกข้อมูลมา
    // console.log(req.body)
    // const {message} = req.body
    // console.log(req.file)
    // console.log(req.user)
    // res.json({msg: 'Create Post', filename : req.file.originalname, message: message , user: req.user.firstName})
    
    const {message} = req.body
    const haveFile = !!req.file
    let uploadResult = {}
    console.log('path.parse(req.file.path).name',path.parse(req.file.path).name)
    if(haveFile){
        uploadResult = await cloudinary.uploader.upload(req.file.path,{
            overwrite : true, 
            public_id : path.parse(req.file.path).name
        })
        fs.unlink(req.file.path)
    }
    // console.log(uploadResult)

    const data = {
        message : message, 
        image : uploadResult.secure_url || '',
        userId : req.user.id

    }
    const rs = await prisma.post.create ({data:data})
    res.status(201).json({msg: "create post done", result: rs})

})

module.exports.getAllPosts = async (req, res) =>{
    res.json({msg: 'Get All Post'})
}

module.exports.updatePost = async (req, res) =>{
    res.json({msg: 'Update Post'})
}

module.exports.deletePost = async (req, res) =>{
    res.json({msg: 'Delete Post'})
}