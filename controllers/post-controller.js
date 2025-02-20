
const path = require('path')
const fs = require('fs/promises')
const tryCatch =require('../utils/tryCatch')
const cloudinary =require('../config/cloudinary')
const prisma = require('../models')
const createError = require('../utils/createError')



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
    // console.log('path.parse(req.file.path).name',path.parse(req.file?.path).name)
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

module.exports.getAllPosts = tryCatch(async (req, res) =>{
    const rs = await prisma.post.findMany({
        orderBy : {createdAt : 'desc'},
        include : {
            user : {
                select :{
                    firstName : true, lastName : true, profileImage : true,
                }
            },
            comments : {
                // select :{ message : true }
                include : {
                    user :{
                        select : {
                            firstName : true, lastName : true, profileImage : true,
                        }
                    }
                }
            },
            likes : {
                include : {
                    user : {
                        select :{
                            firstName : true, lastName : true, profileImage : true,
                        }
                    }
                }
            }
        }
    })
    res.json({posts : rs})
})

module.exports.updatePost =tryCatch( async (req, res) =>{
    const {id} = req.params
    const {message, removePic} = req.body

    const postData = await prisma.post.findUnique({where : {id : +id}})
    if(!postData ||req.user.id !== postData.userId){
        createError(400,'Cannot edit this post')
    }
    const haveFile =!!req.file
    if(haveFile){
        uploadResult = await cloudinary.uploader.upload(req.file.path,{
            overwrite : true, 
            public_id : path.parse(req.file.path).name
        })
        fs.unlink(req.file.path)
    }
    let data = haveFile
    ?{message, image: uploadResult.secure_url,userId : req.user.id}
    :{message, userId: req.user.id, image: removePic ? '': postData.image}
    const rs = await prisma.post.update({
        where : {id : +id},
        data : data
        
    })
    // console.log("rssssssss",rs)
    res.json({msg: 'Update Post'})
})





module.exports.deletePost = tryCatch(async (req, res) =>{
    const {id} = req.params
    if(!id){
        createError(400, 'require id params')
    }
    const postData = await prisma.post.findUnique({where : {id : +id}})
    console.log(postData)
    if(req.user.id !== postData.userId) {
        createError(400,'Cannnot delete')
    }
    const rs = await prisma.post.delete({
        where : {id : +id}
    })

    res.json({msg : `Delete post id=${id} done`, deletePdost: postData})
})