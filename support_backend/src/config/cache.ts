import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // 10 min default TTL

export const initializeCache = () => {
    console.log('✅ Cache initialized');
};

export const getCache = (key: string) => cache.get(key);
export const setCache = (key: string, value: any, ttl?: number) =>
    ttl === undefined ? cache.set(key, value) : cache.set(key, value, ttl);
export const deleteCache = (key: string) => cache.del(key);
export const flushCache = () => cache.flushAll();

export default cache;