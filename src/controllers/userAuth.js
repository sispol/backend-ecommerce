// onlyAdmin define si autoriza admins y lo verifica en el objeto userDB
let onlyAdmin = true;
let userToAuth = 'admin'//req.body.username

const userDB = [{username: 'user', isAdmin: false},
                {username: 'admin', isAdmin: true}                
                ]
                
const userAuth = (req, res, next) => {
    const user = userDB.find(x => x.username === userToAuth)

    if (user !== undefined) {
        if (onlyAdmin === true && user.isAdmin === true ) {
            console.log('administrador autorizado')
        } else if (onlyAdmin === false) {
            console.log('usuario autorizado')
        } else {
        console.log('usuario NO autorizado')
        return res.status(404).json({error: "Usuario no autorizado"})
        }
    } else {
        console.log('usuario NO autorizado')
        return res.status(404).json({error: "Usuario inexistente"})
    }
    next()
}

module.exports = { userAuth }