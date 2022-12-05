require('dotenv').config
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri

const { default: axios } = require('axios')
const querystring = require('querystring')
const randomstring = require('randomstring')

const Authorization = 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))

const login = async (req, res) => {
  const state = randomstring.generate(16);
  //console.log(requestAccess);
  await res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: state
  }));
}

const requestAccess = async (req, res) => {
  const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'Authorization': Authorization ,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      json: true
    };
  
    axios(authOptions)
    .then((data) => {
      return access_token.save()
    })
    .catch((err ) => {return err})
}

const refreshAccess = async (req, res) => {
  const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'Authorization': Authorization ,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    axios(authOptions)
    .then((data) => {
      return access_token.save()
    })
    .catch((err ) => {return err})
}


const auth = async (req, res) => {
  if (req.access_token) {
    res.redirect('http://localhost:3000')
  } else {
    res.redirect('http://localhost:3001/spotify/v1/login')
  }
}


module.exports = {
	login, auth
}