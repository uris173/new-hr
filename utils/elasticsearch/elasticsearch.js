import { Client } from "@elastic/elasticsearch";
import { createUserIndex } from "./index/user.index.js";

let client = null;

export const elasticsearchConnection = async () => {
  try {
    client = new Client({ node: process.env.ELASTICSEARCH_URL });
    console.log('Elasticsearch connected!');
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

export const getElasticClient = async () => {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve(client);
    } else {
      reject("Elasticsearch client not initialized");
    }
  });
};