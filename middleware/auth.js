
const isLogin = (req, res, next) => {  //! middleware global
    console.log(req.session)
    if (!req.session.userId) {
        const error = 'Please login first!'
        res.redirect(`/login?error=${error}`)
    } else {
        console.log('Time:', Date.now())
        next()
    }
}

const isAdmin = (req, res, next) => {  //! middleware global
    console.log(req.session)
    if (req.session.role && req.session.role !== 'admin') {
        const error = 'You have no access!'
        res.redirect(`/login?error=${error}`)
    } else {
        console.log('Time:', Date.now())
        next()
    }
}
// const mw = function (req, res, next) {  //! func middleware per route
//     console.log('Time:', Date.now())
//     next()
// }
module.exports = { isLogin, isAdmin };