const https = require('https');

const options = {
  hostname: 'uk.trustpilot.com',
  path: '/review/terrifictravel.co.uk',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.9',
  }
};

https.get(options, (res) => {
  let data = '';
  console.log('STATUS:', res.statusCode);
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('HTML length:', data.length);
    // Search for review count pattern or schema
    const countMatch = data.match(/"numberOfReviews":\s*(\d+)/) || data.match(/based on (\d+)\s+reviews/i) || data.match(/(\d+)\s+reviews/i);
    console.log('Count Match:', countMatch);

    const scoreMatch = data.match(/"trustScore":\s*([\d.]+)/) || data.match(/trustScore\\":\s*([\d.]+)/);
    console.log('Score Match:', scoreMatch);

    // Search for JSON-LD script or Next data
    const nextDataMatch = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    if (nextDataMatch) {
      console.log('Found __NEXT_DATA__!');
    }
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
