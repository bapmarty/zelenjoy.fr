var express = require('express');
var fetch = require("node-fetch");
var router = express.Router();

const CHANNEL       = "zelenjoy";
const CLIENT_ID     = 'YOUR_PUBLIC_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_PRIVATE_CLIENT_ID';
const REDIRECT_URI  = "http://localhost:3001/api/callback";

/*
  GET /api/callback
*/
router.get('/', function(req, res, next) {
    fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`, {
        method: 'POST'
    })
    .then(resp => resp.json())
    .then(data => {
        res.cookie('twitch_access_token', data.access_token, { expires: new Date(new Date().getTime()+21600000) });
        res.cookie('twitch_refresh_token', data.refresh_token, { expires: new Date(new Date().getTime()+21600000) });
        res.redirect('http://localhost:3000');
    })
    .catch(() => res.json({error: "Error capout"}) );
});

module.exports = router;
