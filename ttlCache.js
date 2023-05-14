class Cache 
{
    constructor(defaultExpiryDuration = Infinity, cleanUpInterval = 0)
    {
        if(defaultExpiryDuration === 0)
        {
            defaultExpiryDuration = Infinity;
        }
        this.defaultExpiryDuration = defaultExpiryDuration;

        this.kvstore = new Map();

        if(cleanUpInterval > 0)
        {
          this.cleanUp = setInterval(() => {this.purge();}, cleanUpInterval);
        }   
    }

    async set(key, value, expiryDuration = this.defaultExpiryDuration) 
    {
        return new Promise((resolve, reject) => {
            if(this.kvstore.has(key))
            {
                reject('Key already exists');
                return;
            }
    
            let expireAt;
    
            if (expiryDuration > 0) {
            expireAt = Date.now() + expiryDuration;
            }
    
            this.kvstore[key] = {
            value: value,
            expireAt: expireAt,
            };
            resolve();
        });     
    }
    
    async get(key) 
    {
        return new Promise((resolve, reject) => {

            const data = this.kvstore[key];

            if (!data) {
            reject('Key does not exist');
            return;
            }
    
            const { value, expireAt } = data;
    
            if (expireAt && Date.now() >= expireAt) {
            delete this.kvstore[key];
            return undefined;
            }
            resolve(value);
        });
    }

    purge()
    {
        console.log('purging');
        const now = Date.now();

        for(const [key, {expireAt}] of this.kvstore.entries())
        {
            if(expireAt && now >= expireAt)
            {
                delete this.kvstore[key];
            }
        }
    }

    stopCleaning() {
        clearInterval(this.cleanUp);
        this.cleanUp = null;
    }

    

}

module.exports = Cache;




