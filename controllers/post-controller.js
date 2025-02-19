module.exports.createPost = async (req, res) =>{
    console.log(req.body)
    const {message} = req.body
    console.log(req.file)
    console.log(req.user)
    res.json({msg: 'Create Post', filename : req.file.originalname, message: message , user: req.user.firstName})
}

module.exports.getAllPosts = async (req, res) =>{
    res.json({msg: 'Get All Post'})
}

module.exports.updatePost = async (req, res) =>{
    res.json({msg: 'Update Post'})
}

module.exports.deletePost = async (req, res) =>{
    res.json({msg: 'Delete Post'})
}