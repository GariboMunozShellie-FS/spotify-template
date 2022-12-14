require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const spotify = require('./middlewares/spotify')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.set('views', __dirname + '/templates')
app.set('view engine', 'twig')

app.use('/spotify/v1', spotify)

app.listen(process.env.PORT)