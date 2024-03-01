var express = require('express');
var router = express.Router();
const axios = require('axios');

// add you generated token here
const client_SECRET = ""

// endpoint to getting the users generated token
// source for axios
// https://v2.vuejs.org/v2/cookbook/using-axios-to-consume-apis.html?redirect=true
router.post('/getToken', async (req, res) => {
    

    try {
        const code = req.body.code;
        const client_ID = req.body.client_id;
        console.log(code)
        // source for having the right urlParams
        // https://www.youtube.com/watch?v=rRn2EisxPl4&t=882s&ab_channel=CooperCodes
        const urlParams = "?client_id=" + client_ID + "&client_secret=" + client_SECRET + "&code=" + code;
        const response = await axios.post('https://github.com/login/oauth/access_token'+ urlParams);
        console.log(response.data)
        res.json(response.data);
        
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

// endpoint to getting users starred repositories
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