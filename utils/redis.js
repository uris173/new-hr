import { createClient } from "redis";

/*
  session:userId:role
*/

const timeMap = {
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2678400
}

const getEx = (type) => timeMap[type] || timeMap.week;

const client = createClient({
  url: "redis://localhost:6379"
});

client.on('error', (error) => {
  console.error('Redis Error:', error);
});

export const initializeRedis = async () => {
  try {
    await client.connect();
    console.log('Redis connected!');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

export const getRedisData = async (key) => {
  try {
    return JSON.parse(await client.get(`new-hr:${key}`));
  } catch (error) {
    console.error('Error getting Redis data:', error);
    return null;
  }
};

export const getRedisAllData = async (pattern) => {
  try {
    const keys = await client.keys(`new-hr:${pattern}`);
    let datas = [];

    for (const key of keys) {
      const data = JSON.parse(await client.get(key));
      if (data) datas.push(data);
    }

    return datas;
  } catch (error) {
    console.error('Error getting all data from Redis:', error);
    return [];
  }
};

export const setRedisData = async (key, value, exType) => {
  try {
    let ex = getEx(exType);
    await client.set(`new-hr:${key}`, JSON.stringify(value), { EX: ex });
    // console.log(`Data set in Redis for key ${key} with expiration of ${ex} seconds.`);
  } catch (error) {
    console.error('Error setting Redis data:', error);
  }
};

export const deleteRedisData = async (key) => {
  try {
    const result = await client.del(`new-hr:${key}`);
    if (result) {
      console.log(`Key ${key} deleted successfully.`);
    } else {
      console.log(`Key ${key} does not exist.`);
    }
    return result;
  } catch (error) {
    console.error('Error deleting Redis data:', error);
    return null;
  }
};

export const deleteRedisPatternData = async (pattern) => {
  try {
    const keys = await client.keys(`new-hr:${pattern}`);

    if (keys.length > 0) {
      await client.del(`new-hr:${keys}`);
      console.log(`Deleted keys: ${keys.join(', ')}`);
    } else {
      console.log('No keys matched the pattern.');
    }
  } catch (error) {
    console.error('Error deleting Redis data:', error);
  }
};