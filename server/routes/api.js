var express = require('express');
var router = express.Router();
const axios = require('axios');

const client_ID = ""
const client_SECRET = ""

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
