import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import MongoDbSetup from "./db/index.js";
import Routes from "./routes/index.js";
import {catchErrorHandler} from "./middlewares/catch-error-handler.js";


class PaymentsApp {

    // The app port.
    port;

    //express app instance.
    app;

    //The mongodb DB instance
    db;

    constructor() {
        this.port = process.env.PORT;
        this.app = express();
    }

    async bootstrap() {
        const MongoDB = new MongoDbSetup();
        this.db = await MongoDB.run();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(new Routes().router);
        this.app.use(catchErrorHandler);
    }

    main() {
        this.middlewares();
        this.app.listen(this.port, async () => {
            await this.bootstrap();
            console.log(`Payment service is running on port ${this.port}: http://localhost:${this.port}`)
        });
    }
}

const App = new PaymentsApp();
App.main();