module.exports.register = (req,res)=>{
    res.json({msg : "Register..."})
}

module.exports.login = (req,res)=>{
    res.json({meg:"Login...."})
}

module.exports.getMe = (res,req)=>{
    req.json({msg: "GetMe..."})
}