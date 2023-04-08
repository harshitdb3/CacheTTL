const Cache = require('./ttlCache.js');

const cache = new Cache(0, 1000); 



cache.set('myKey', 'myValue', 3000);

setInterval(() => {console.log(cache.get('myKey'));}, 1000);

