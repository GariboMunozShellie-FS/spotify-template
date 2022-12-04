require('dotenv').config
const client_id = process.env.client_id
const client_secret = process.env.client_secret
const redirect_uri = process.env.redirect_uri

const querystring = require('querystring')
const randomstring = require('randomstring')


const login = async (req, res) => {
  const state = randomstring.generate(16);
  console.log(requestAccess);
  await res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: redirect_uri,
      state: state
  }));
}

const requestAccess = async (req, res) => {
  let code = req.query.code || null
  let state = req.query.state || null

  if (state === null) {
    res.redirect('/auth' +
      querystring.stringify({
        error: 'state_mismatch'
      })
    );
  }
  else{
    const authOption = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token', 
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers:{
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
      //.then(console.log(res.access_token))
    }
  }
}

const auth = async (req, res) => {
  if (req.token) {
    res.redirect('http://localhost:3000')
  } else {
    res.redirect('http://localhost:3001/spotify/v1/login')
  }
}


module.exports = {
	login, auth
}