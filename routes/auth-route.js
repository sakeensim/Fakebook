const express = require("express")
const authRoute = express.Router()
const { register, login, getMe } = require("../controllers/auth-controller")
const authenticate = require("../middlewares/authenticate")

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.get('/me', authenticate, getMe)


module.exports = authRoute