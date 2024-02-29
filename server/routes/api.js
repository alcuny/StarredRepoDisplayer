var express = require('express');
var router = express.Router();
const axios = require('axios');

const client_ID = "e42429a78f551d96c4a8"
const client_SECRET = "cb073dfa4a8c943079866bd0eb0827c2df28c1db"

router.post('/getToken', async (req, res) => {
    const code = req.body.code;
    console.log(code)
    const urlParams = "?client_id=" + client_ID + "&client_secret=" + client_SECRET + "&code=" + code;

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token'+ urlParams);
        console.log(response.data)
        res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

router.get('/getStarredRepos', async (req, res) => {
    console.log(req.get("Authorization"));
    try {
        const response = await axios.get('https://api.github.com/user/starred', {
            headers: {
                "Authorization": req.get('Authorization')
            }
        });
        //console.log(response.data)
        res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch userData' });
    }

})

module.exports = router;
