require('dotenv').config()
const express = require("express")
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/errorMiddleware')
const authRoute = require('./routes/auth-route')


const app = express()



// app.use("*",()=>{}) รับได้ทุก method
// app.get("*",()=>{}) รับแค่ Get

    app.use(express.json())


    app.use("/auth",authRoute)
    app.use("/post",(req,res)=>{res.send('post service')})
    app.use("/comment",(req,res)=>{res.send('comment service')})
    app.use("/like",(req,res)=>{res.send('send service')})


//notFound
    app.use(notFound)

// error Middleware
    app.use(errorMiddleware)

const port = process.env.PORT || 8000
app.listen(port, ()=> console.log("Server running on port",port))