const https = require('https');

function check(url) {
  https.request(url, { method: 'HEAD' }, (res) => {
    console.log(url, res.statusCode);
  }).end();
}

check('https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/ATOL_logo.svg/120px-ATOL_logo.svg.png');
check('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/IATA_logo.svg/200px-IATA_logo.svg.png');
