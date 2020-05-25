const { User } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        if (created){
            return res.status(201).json({
                success:'true',
                msg: `Nouvel utilisateur créé ${username} !`,
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
    signin(req, res) {
        const { body: { username } } = req
        return res.status(200).json({
            msg: `Bienvenue ${ username } !`
        })
    }
}