import { getElasticClient } from "../elasticsearch.js";

export const createUserIndex = async () => {
  let elasticsearch = await getElasticClient();
  let findIndex = await elasticsearch.indices.exists({ index: 'user' });
  if (!findIndex) {
    
  }
};