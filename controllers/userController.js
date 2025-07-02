const { render } = require("ejs")


class userController {
    static async homePage (req, res) {
        try {
            res.render('homepage')
        } catch (error) {
            console.log(error, '========');
            
            res.send(error)
        }
    }
}

module.exports = userController