const jwt = require('jsonwebtoken')
const prisma = require('../models')
const createError = require("../utils/createError")
const tryCatch = require('../utils/tryCatch')


module.exports = tryCatch(async (req,res,next)=>{
    console.log("first")
    const authorization = req.headers.authorization
    //check header of http request must have authorization
    if(!authorization || !authorization.startsWith('Bearer')){
        createError(401,"Unauthor1zed 1")
    }
    const token = authorization.split(' ')[1]
    console.log(token)
    if(!token){
        createError(401, "Unthorization 2")
    }
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    console.log(payload)

    //Find user by payload.ID
    const foundUser = await prisma.user.findUnique({
        where : {id : payload.id}
    })
    console.log(foundUser)
    if(!foundUser){
        createError(401,"Unauthorization 3")
    }

    // creat userData without key: password, created, updatedAt
    const {password, createdAt, updatedAt, ...userData} = foundUser
    console.log(userData)
    //ฝากข้อมูล user ไว้ที่ req object : key ชื่อ req.user
    req.user = userData
    next()
})