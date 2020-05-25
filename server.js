const express = require('express')
const helmet = require('helmet')
let cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')

const adminRouter = require('./routers/adminRouter').router
const authRouter = require('./routers/authRouter').router

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())


app.use('/admin/', adminRouter)
app.use('/auth/', authRouter)
app.set('view engine', 'html')
app.use(express.static('front'));

app.get('/', function(req, res, next) {
    res.render('index')
});

app.listen(8080, () => console.log('Serveur lancé sur le port 8080'))