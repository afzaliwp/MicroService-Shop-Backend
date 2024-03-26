import mongoose from "mongoose";
import {OrderModel} from "./schema/order.js";

class MongoDbSetup {
    constructor() {
        this.uri = process.env.MONGODB_URI;
        this.dbName = process.env.MONGODB_NAME;
    }

    async connect() {
        await mongoose.connect(`${this.uri}/${this.dbName}`);
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }

    async run() {
        try {
            await this.connect();
            await this.initializeModels();
            console.log(`MongoDB is established.`);
        } catch (error) {
            console.error(`Failed to establish MongoDB connection: ${error}`);
        }
    }

    async initializeModels() {
        const models = {};
        models.orderModel = new OrderModel(this.db);

        return models;
    }
}

export default MongoDbSetup;