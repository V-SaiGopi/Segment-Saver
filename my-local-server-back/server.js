const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/proxy', (req, res) => {
  axios.post('https://webhook.site/d0bd8f1c-a679-4a0f-a4cd-f195c1a54b21', req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).send(error.message);
    });
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
