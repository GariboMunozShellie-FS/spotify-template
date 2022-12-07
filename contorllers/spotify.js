require('dotenv').config
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri
const { SpotifyToken } = require('../models')

const axios = require('axios')
const querystring = require('querystring')
const qs = require('qs')
const randomstring = require('randomstring')

const Authorization = 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))


const requestAccess = async (code, grant_type, token) => {
  const form = qs.stringify({ code, grant_type, redirect_uri })
  const authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Authorization': Authorization ,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form
  };
  return axios(authOptions)
  .then(({data}) => {
    token.update(data)
    return token.save()
  })
  .catch((err ) => {return err})
}

const jwt = async (req, res, next) => {
  req.token = await SpotifyToken.findOne({ where: {} })
  
  if (!req.token) {
    if (!req.query.code) { 
      return next() 
    }
    else if (req.query.code) { 
      req.token = await requestAccess(req.query.code, 'authorization_code', SpotifyToken.build({}))
      
  }
    else {
      res.json({ error: 'Something went wrong, please try again' })
    }
  }
  console.log(req.token);
  return next()
}

const auth = async (req, res) => {
  //requestAccess()
  //console.log(req.query.code, 'Auth Function Else statement');
  //res.send(`spotify auth code: ${req.query.code}`)
    if (req.token) {
      res.redirect('http://localhost:3000')
    } else {
      res.redirect('http://localhost:3001/spotify/v1/login')
     
    }
}
const login = async (req, res) => {
  const state = randomstring.generate(16);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      redirect_uri,
      state
  }));
}



module.exports = {
	login, jwt, auth
}