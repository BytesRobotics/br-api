import {Db, ObjectID} from 'mongodb';
const getMongoDBClient = require('../db/mongodbClient');

export class BaseRepository {

  dbClient: any;
  collection: string;

  constructor(collectionName: string) {
    this.dbClient = getMongoDBClient();
    this.collection = collectionName;
  }

  getCount() {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .countDocuments());
  }

  getCountFiltered(filter: any = {}) {
    return this.dbClient
      .then((db: Db) => {
        // filtering here
        return db.collection(this.collection).countDocuments(filter.query);
      });
  }

  findById(id: string) {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .findOne({ _id: new ObjectID(id) }));
  }

  add(item: string) {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .insertOne(item));
  }

  addMany(items: any[]) {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .insertMany(items));
  }

  edit(id: string, item: any) {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .updateOne({ _id: new ObjectID(id) }, { $set: item }, { upsert: true }));
  }

  delete(id: string) {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .remove({ _id: new ObjectID(id) }));
  }

  list() {
    return this.dbClient
      .then((db: Db) => db
        .collection(this.collection)
        .find());
  }

  listFiltered(filter: any) {
    return this.dbClient
      .then((db: Db) => {
        const data = db.collection(this.collection)
          .find(filter.query || {}).sort({_id: -1});

        if (filter.pageSize && filter.pageNumber) {
          data
            .skip(parseInt(filter.pageSize, 10) * (parseInt(filter.pageNumber, 10) - 1))
            .limit(parseInt(filter.pageSize, 10));
        }

          if (filter.sortBy && filter.orderBy) {
            const sortSettings = { [filter.sortBy]: filter.orderBy === 'ASC' ? 1 : -1 };

            data.collation({ locale: 'en' }).sort(sortSettings);
          }

        return data.toArray();
      });
  }
}
