const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname+'/public', '/')));

app.post('/api/getUserInfo', async (req, res) => {
    let op;
    let paramName;
    let input = req.body.nickname; // Assuming the input is provided in the "nickname" field

    // Determine whether the input is a nickname or a mobile number
    if (isNaN(input)) {
        // If the input is not a number, treat it as a nickname
        op = 'getUserInfobyNickname';
        paramName = 'nickname';
    } else {
        // If the input is a number, treat it as a mobile number
        op = 'getUserInfo';
        paramName = 'msisdn';

        // Add country code '88' if it's missing
        if (!input.startsWith('88')) {
            input = `88${input}`;
        }
    }

    console.log(`Received request for ${op}: ${input}`);

    const url = 'http://circle.robi.com.bd/mylife/appapi/appcall.php';
    const headers = {
        'x-app-key': '000oc0so48owkw4s0wwo4c00g00804w80gwkw8kg',
        'x-api-key': 'a11b9ce756f437308e449831e18aa7cb',
        'User-Agent': 'gzip',
    };

    try {
        const response = await axios.get(`${url}?op=${op}&${paramName}=${input}`, { headers });
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
