import Redis from "ioredis";

const redis = new Redis();

export const redisSet = async (key, value, ttl = 0) => {
	try {
		await redis.set(key, value);
		if (ttl > 0) {
			await redis.expire(key, ttl);
		}
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};

export const redisGet = async (key) => {
	try {
		const value = await redis.get(key);
		return value;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const redisFlushAll = async () => {
	try {
		await redis.flushall();
	} catch (error) {
		console.log(error);
		return false;
	}
	return true;
};

// export default redis;
