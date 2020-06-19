const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const jwtSecret = "secret"
const generateJwt = (id,name,role) =>{
    return jwt.sign({
        iss:'http://localhost:3000',
        id,
        name,
        role,
        exp:parseInt(Date.now() / 1000 + 60 * 60) // une heure
    },jwtSecret)
}

module.exports = {
    async signup(req, res) {
        const { body: { username, email,password } } = req
        const emailRegex = 	/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/;

        if (username === ""){
            return res.status(400).json({
                success:'false',
                msg: ` Username est obligatoire !`
            })
        }

        if (!passwordRegex.test(password)){
            return res.status(400).json({
                success:'false',
                msg: ` mot de passe entre 4 et 8 caractères`
            })
        }

        if (!emailRegex.test(email) ){
            return res.status(400).json({
                success:'false',
                msg: `Email incorrect`
            })
        }

        const [user, created] = await User.findOrCreate({
            where: { username: username,  email:email },
            defaults: {
                isAdmin: "false",
                password: bcrypt.hashSync(password, saltRounds)
            }
        });
        if (created) {
            const token = generateJwt(created.id, created.username, created.isAdmin)
            return res.status(201).json({
                succes:true,
                msg: 'Nouvel utilisateur créé !',
                username,
                token,
            })
        }
        else {
            if (user.username === username || user.email === email){
                return res.status(400).json({
                    success:'false',
                    msg: 'email ou username déjà utilisé'
                })
            }
        }

    },
    async signin(req, res) {
        const {name,password} = req.body;
        const user = await User.findOne({
            where: { username: name},
        });
        if (!user){
            return res.status(401).json({msg:`access refused`});
        }
        else{
            if(bcrypt.compareSync(password, user.password)){
                const token = generateJwt(user.id, user.username, user.isAdmin)
                return res.status(201).json({
                    success:true,
                    msg: 'utilisateur connecté !',
                    name,
                    "id":user.id,
                    "email":user.email,
                    "isAdmin": user.isAdmin,
                    token
                })
            }
            else{
                return res.status(400).json({
                    success:false,
                    msg: 'mot de passe incorrect !',
                    name
                })
            }
        }
    }
}