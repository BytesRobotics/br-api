import { MongoClient} from 'mongodb';
import config from 'config';
import {logger} from '../utils/logger';

const mongoClient = MongoClient;

let dbClient: any = null;

module.exports = function getMongoDBClient() {
  if (dbClient) {
    return dbClient;
  }
  logger.info('Connecting to MongoDB client...');

  const { url, name } = config.get('db');
  dbClient = mongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
      logger.info('MongoDB client has been successfully created');

      return client.db(name);
    })
    .catch(err => {
      logger.error(`Error occurred while connecting to mongodb: ${err}`);
    });

  return dbClient;
};
