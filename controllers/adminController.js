const { User } = require('../models');
module.exports = {
    getUsers(req, res) {
        return res.status(200).json({
            users: [ 'Loulou', 'Fifi', 'Riri' ]
        })
    },
    async getUser(req, res) {
        try {
            let { params: { id } } = req.token
            const TokenId = id
            let user = await User.findOne({
                where: { id: TokenId},
            });
            if (user){
                return res.status(201).json({
                    "id":user.id,
                    "username":user.username,
                    "email":user.email,
                    "isAdmin": user.isAdmin,
                })
            }
        }
        catch (e) {
            console.log(e)
            res.status(401).json({msg : 'Accès refusé !'})
        }

    },
    deleteUser(req, res) {
        const { params: { id } } = req
        return res.status(200).json({
            msg: `Utilisateur ${id} supprimé.`
        })
    }
}