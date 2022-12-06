require('dotenv').config
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri
const { SpotifyToken } = require('../models')

const axios = require('axios')
const querystring = require('querystring')
const t = 5
const randomstring = require('randomstring')

const Authorization = 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))


const requestAccess = async (code, grant_type, token) => {
  const authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Authorization': Authorization ,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    code,
    redirect_uri,
    grant_type,
  };
  return axios(authOptions)
  .then(({data}) => {
    token.update(data)
    console.log(data);
    return token.save()
  })
  .catch((err ) => {return err})
}

const jwt = async (req, res, next) => {
  req.token = await SpotifyToken.findOne({ where: {} })
  console.log(req.token);
  if (!req.token) {
    if (!req.query.code) { 
      return next() 
    }
    else if (req.query.code) { 
      return req.token = await requestAccess(req.query.code,'authorization_code', SpotifyToken.build({}))
    }
    else {
      res.json({ error: 'Something went wrong, please try again' })
    }
  }
  return next()
}

const auth = async (req, res) => {
  if (req.token) {
    res.redirect('http://localhost:3000')
    //console.log(req.token);
  } else {
    res.redirect('http://localhost:3001/spotify/v1/login')
    //console.log(req.query.code, 'Auth Function Else statement');
  }
}
const login = async (req, res) => {
  const state = randomstring.generate(16);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id:client_id,
      redirect_uri: redirect_uri,
      state: state
  }));
}



module.exports = {
	login, auth, jwt
}