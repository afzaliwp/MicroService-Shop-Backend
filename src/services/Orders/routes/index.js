import { Router } from 'express';
import OrderRoutes from './orders.js';

class Routes {
    constructor() {
        this.router = Router();
        this.handleRoutes();
    }

    handleRoutes() {
        this.router.use('/orders', new OrderRoutes().router);
    }
}

export default Routes;
