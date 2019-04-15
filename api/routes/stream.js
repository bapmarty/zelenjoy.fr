var express = require('express');
var fetch = require("node-fetch");
var router = express.Router();

const CHANNEL = "zelenjoy";
const CLIENT_ID     = 'YOUR_PUBLIC_CLIENT_ID';


function twitch(endpoint) {
    return `https://api.twitch.tv/kraken/${endpoint}/${CHANNEL}?client_id=${CLIENT_ID}`;
}

/*
  GET /api/stream
*/
router.get('/', function(req, res, next) {
    fetch(twitch('streams'))
    .then(resp => resp.json())
    .then(stream_data => {
        if (stream_data.stream != null) {
            res.json({
                online: true,
                title: stream_data.stream.channel.status,
                game: stream_data.stream.game,
                followers: stream_data.stream.channel.followers,
                display_text: "Viewers",
                display_count: stream_data.stream.viewers
            });
        }
        else {
            fetch(twitch('channels'))
            .then(resp => resp.json())
            .then(channel_data => {
                res.json({
                    online: false,
                    title: channel_data.status,
                    game: channel_data.game,
                    display_text: "Followers",
                    display_count: channel_data.followers
                });
            })
            .catch(() => res.json({error: "Error retrieving channel data"}));
        }
    })
    .catch(() => res.json({error: "Error retrieving stream data"}) );
});

module.exports = router;