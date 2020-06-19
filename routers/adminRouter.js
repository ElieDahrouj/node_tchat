const express = require('express')
const jwt = require('jsonwebtoken')
const jwtSecret = "secret"
const adminController = require('../controllers/adminController')
const checkJwt = (req, res, next) => {
    try {
        if (!req.header('Authorization'))
        {
            throw "pas de header Autorization dans la requête !"
        }
        const authorizationParts = req.header('Authorization').split(' ')
        let token = authorizationParts[1]
        jwt.verify(token,jwtSecret,(err, decodeToken) =>{
            if (err){
                throw err
            }
            req.token = decodeToken
            next()
        })
    }
    catch (e) {
        console.log(e)
        res.status(401).json({msg : 'Accès refusé !'})
    }
}
exports.router = (() => {
    const adminRouter = express.Router()
    adminRouter.route('/:id').all(checkJwt).get(adminController.getUser)
    return adminRouter
})()