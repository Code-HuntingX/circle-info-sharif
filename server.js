const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

app.post('/getUserInfo', async (req, res) => {
    const nickname = req.body.nickname;
    console.log(`Received request for nickname: ${nickname}`);

    const url = 'http://circle.robi.com.bd/mylife/appapi/appcall.php';
    const headers = {
        'x-app-key': '000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg',
        'x-api-key': 'a11b9ce756f437308e449831e18aa7cb',
        'User-Agent': 'gzip',
    };

    try {
        const response = await axios.get(`${url}?op=getUserInfobyNickname&nickname=${nickname}`, { headers });
        console.log(`Response from external API: ${JSON.stringify(response.data)}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user information:', error.message);
        res.status(500).json({ error: 'Error fetching user information.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
