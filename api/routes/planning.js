var express = require('express');
var router = express.Router();

/*
  GET /api/planning
*/
router.get('/', function(req, res, next) {
	res.json(
		{
			"nextStream": {
				"start": "21h",
				"end": "3h",
				"game": "League of Legends"
			},
			"monday": [
				{
					"start": "21h",
					"end": "3h",
					"game": "League of Legends"
				},
				{
					"start": "23h",
					"end": "24h",
					"game": "Osu!"
				}
			],
			"tuesday": [
				{
					"start": "0h",
					"end": "2h",
					"game": "Just chatting"
				}
			]
		}
	);
});

module.exports = router;
