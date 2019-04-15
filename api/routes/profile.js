var express = require('express');
var fetch = require("node-fetch");
var router = express.Router();

const CLIENT_ID     = 'YOUR_PUBLIC_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_PRIVATE_CLIENT_ID';

function twitch(endpoint, req, version = 'new') {
    if (version === 'v5') {
        return fetch(endpoint, {
            method: 'GET',
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `OAuth ${req.cookies['twitch_access_token']}`,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        });
    }
    else {
        return fetch(endpoint, {
            method: 'GET',
            headers: {
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${req.cookies['twitch_access_token']}`
            }
        });
    }
}

/*
  GET /api/profile
*/
router.get('/', function(req, res) {
    twitch(`https://api.twitch.tv/helix/users`, req).then(resp => resp.json())
    .then(profile => {
        //res.json(profile);
        profile = profile.data[0]
        twitch(`https://api.twitch.tv/helix/users/follows?from_id=${profile.id}&to_id=146285949`, req).then(resp => resp.json())
        .then(follow => {
            //res.json(follow);
            twitch(`https://api.twitch.tv/kraken/users/${profile.id}/subscriptions/146285949`, req, 'v5').then(resp => resp.json())//TODO: Update to New API (endpoint not found yet)
            .then(sub => {
                //res.json(sub)
                res.json({
                    id: profile.id,
                    name: profile.display_name,
                    logo: profile.profile_image_url,
                    follow: follow.total > 0,
                    follow_since: follow.data[0].followed_at || null,
                    sub: !sub.hasOwnProperty('error'),
                    sub_since: sub.created_at || null
                });
            }).catch(() => res.json({error: "Error retrieving user subscription"}) );
        }).catch(() => res.json({error: "Error retrieving user follow"}) );
    }).catch(() => /*res.status(301).redirect(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:3001/api/callback&scope=user_follows_edit+user_subscriptions`)*/ res.json({error: "Error retrieving user profile"}) );
});

module.exports = router;