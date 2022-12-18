require('dotenv').config
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri
const { ASpotifyToken } = require('../models')

const axios = require('axios')
const querystring = require('querystring')
const randomstring = require('randomstring')

const Authorization = 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
const now = new Date().getTime()

const index = (req, res) => {
    res.render('views/home' )
}

const requestAccess = async (code, grant_type, token) => {
  const form = (grant_type === "refresh_token") 
    ? ({ refresh_token: code, grant_type })
    : ({ code, grant_type, redirect_uri }) 

  const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      form,
      headers: {
        'Authorization': Authorization,
        'Content-Type': 'application/json'
      },
  };
  return axios(authOptions)
  .then(({data}) => {
    data.expires_in = new Date().getTime() + data.expires_in
    token.update(data)
    return token.save()
  })
  .catch((err ) => {return err})
}

const jwt = async (req, res, next) => {
  req.token = await ASpotifyToken.findOne({ where: {} })
  if (!req.token) {
    if (!req.query.code) { 
      return next() 
    }
    else if (req.query.code) { 
      req.token = await requestAccess(req.query.code, 'authorization_code', ASpotifyToken.build({}))
  }
    else if (now > req.token.expires_in) {
      req.token = await requestAccess(req.token.refresh_token, 'refresh_token', req.token)
  }
    else {
      res.json({ error: 'Something went wrong, please try again' })
    }
  }
  console.log(req.token);
  return next()
}

const auth = async (req, res) => {
    if (req.token) {
      res.redirect('http://localhost:3000/')
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

const status = async (req, res) => {
  if ((req.token && req.token.expires_in > now)){
    const valid = true
    res.json({ valid })
  } 
  else{
    const valid = false
    res.json({ valid })
  }
}

const search = async (res, req) => {

  const searchOptions = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/search',
      params: {
        type: 'album,artist,track',
        q: req.query.q,
        limit: 5
      },
      headers: {
        'Authorization': 'Bearer ' + req.token.access_token,
        'Content-Type': 'application/json'
      },
  };
  return axios(searchOptions)
    .then(({data}) => {
      console.log(data)
      res.json(data)
    }).catch((error) => {
      res.json(error)
    })
}



module.exports = {
	login, jwt, auth, status, search, index
}