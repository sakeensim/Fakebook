const prisma = require('../models')
const createError = require("../utils/createError")
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
const tryCatch = require('../utils/tryCatch')


function checkEmailorMobile(identity) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobileRegex = /^[0-9]{10,15}$/

    let identityKey = ''

    if (emailRegex.test(identity)) {
        identityKey = 'email'
    }
    if (mobileRegex.test(identity)) {
        identityKey = 'mobile'
    }
    if (!identityKey) {
        createError(400, 'Only Email or Mobile Phone')
    }
    return identityKey
}



module.exports.register = async (req, res, next) => {
    try {
        const { identity, firstName, lastName, password, confirmPassword } = req.body
        //validation

        if (!(identity.trim() && firstName.trim() && lastName.trim() && password.trim() && confirmPassword.trim())) {
            return createError(400, 'Please fill all data')
        }

        if (password !== confirmPassword) {
            return createError(400, 'confirm password is not matching')
        }

        //identity is an email  or a phone number
        const identityKey = checkEmailorMobile(identity)

        // Is email already exist
        const findIdentity = await prisma.user.findUnique({
            where: { [identityKey]: identity }
        })

        if (findIdentity) {
            createError(409, `Already exist :${identity}`)
        }

        const newUser = {
            [identityKey]: identity,
            password: await bcryptjs.hash(password, 10),
            firstName: firstName,
            lastName: lastName
        }

        const result = await prisma.user.create({ data: newUser })

        console.log(result)
        res.json({ msg: `Register with ${identityKey}` })
    } catch (err) {
        next(err)
    }

}

module.exports.login = tryCatch(async (req, res, next) => {
    const { identity, password } = req.body
    //validation

    if (!identity.trim() || !password.trim()) {
        createError(400, 'Please fill all data')
    }
    //check email or mobile
    const identityKey = checkEmailorMobile(identity)

    //find user
    const foundUser = await prisma.user.findUnique({
        where: { [identityKey]: identity }
    })
    if (!foundUser) {
        createError(401, 'Invalid Login')
    }
    //check password
    let pwOk = await bcryptjs.compare(password, foundUser.password)
    if (!pwOk) {
        createError(401, 'Invalid Login')
    }
    //create token
    const payload = { id: foundUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '29d' })

    //  delete foundUser.password
    //  delete foundUser.creatrdAt
    //  delete foundUser.updatedAt   

    const { password: pw, createdAt, updatedAt, ...userData } = foundUser

    res.json({ msg: "Login Successful", token: token, user: userData })
})

module.exports.getMe = (req, res) => {
    res.json({ user: req.user })
}