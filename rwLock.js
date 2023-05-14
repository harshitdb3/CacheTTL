const Mutex = require('async-mutex').Mutex;

class ReadWriteLock {
    constructor() {
      this.readerMutex = new Mutex();
      this.exclusiveMutex = new Mutex();
      this.readers = 0;
    }
  
    async readLock() {
      await this.readerMutex.acquire();
      this.readers++;
      if (this.readers === 1) {
        // First reader, acquire exclusive lock
        await this.exclusiveMutex.acquire();
      }
      this.readerMutex.release();
    }
  
    async readUnlock() {
      await this.readerMutex.acquire();
      this.readers--;
      if (this.readers === 0) {
        // Last reader, release exclusive lock
        this.exclusiveMutex.release();
      }
      this.readerMutex.release();
    }
  
    async exclusiveLock() {
      await this.exclusiveMutex.acquire();
    }
  
    async exclusiveUnlock() {
      this.exclusiveMutex.release();
    }
  }

  module.exports = ReadWriteLock;