const https = require('https');

https.get('https://dns.google/resolve?name=_mongodb._tcp.cluster0.8jwwtgh.mongodb.net&type=SRV', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log(result.Answer);
  });
});

