import { Router } from 'express';
import CustomerRoutes from './customers.js';

class Routes {
    constructor() {
        this.router = Router();
        this.handleRoutes();
    }

    handleRoutes() {
        this.router.use('/customers', new CustomerRoutes().router);
    }
}

export default Routes;
