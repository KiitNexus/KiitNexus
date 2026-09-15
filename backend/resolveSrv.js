const dns = require('dns');
dns.setServers(['8.8.8.8']);

dns.resolveSrv('_mongodb._tcp.cluster0.8jwwtgh.mongodb.net', (err, addresses) => {
  if (err) {
    console.error("SRV error", err);
    return;
  }
  dns.resolveTxt('cluster0.8jwwtgh.mongodb.net', (err, txt) => {
    let hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    let authOptions = '';
    if (txt) {
      authOptions = txt.flat().join('&');
    }
    const standardUri = `mongodb://KiitNexus:ChandanMukherjee@${hosts}/recruitment?ssl=true&replicaSet=atlas-139pki-shard-0&authSource=admin&${authOptions}`;
    console.log(standardUri);
  });
});

