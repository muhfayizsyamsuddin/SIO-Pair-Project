const express = require('express')
const app = express()
const router = require('./routers/user')
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'rahasia ilahi', //! wajib
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, //! https -> dev: false, production: true
        sameSite: true //! u/ security dri csrf attack
    } //! https
}))

app.use('/', router)

app.listen(port, () => {
    console.log(`running on port ${port} http://localhost:3000`);
    
})