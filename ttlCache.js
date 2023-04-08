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

    set(key, value, expiryDuration = this.defaultExpiryDuration) 
    {
        let expireAt;

        if (expiryDuration > 0) {
        expireAt = Date.now() + expiryDuration;
        }

        this.kvstore[key] = {
        value: value,
        expireAt: expireAt,
        };

    }
    
     get(key) 
    {


        const data = this.kvstore[key];

        if (!data) {
        return undefined;
        }

        const { value, expireAt } = data;

        if (expireAt && Date.now() >= expireAt) {
        delete this.kvstore[key];
        return undefined;
        }
        return value;

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




