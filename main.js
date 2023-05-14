const Cache = require('./ttlCache.js');
var ReadWriteLock = require('./rwLock.js');
const rwLock = new ReadWriteLock();
const cache = new Cache(0, 1000); 

//using a mutex or other synchronization mechanism can be important when dealing with 
//Node.js libraries that perform I/O or network operations in separate threads.

// In the current example since we are not using any I/O or network operations,
// we can remove the mutex and the code will still work as expected.
// However, if we were to use a library that performs I/O or network operations in separate threads,
// we would need to use a mutex or other synchronization mechanism to ensure that the cache is not accessed concurrently.
//An example of I/O operation is the fs module in Node.js, which performs file system operations in a separate thread.
//An example of a network operation is the http module in Node.js, which performs network operations in a separate thread.

async function setCache(key,value,ttl)
{
    await rwLock.exclusiveLock();
    try
    {
        await cache.set(key,value,ttl);
        rwLock.exclusiveUnlock();
    }
    catch(err)
    {
        rwLock.exclusiveUnlock();
        console.log(err);      
    }
}

async function getCache(key)
{
    await rwLock.readLock();
    try
    {
        const value = await cache.get(key);
        rwLock.readUnlock();
        return value;
    }
    catch(err)
    {
        rwLock.readUnlock();
        console.log(err);      
    }
}


setCache('myKey','myValue',1000);

setInterval(async() => {
    const value = await getCache('myKey');
    console.log(value);
}, 1000);

