import { Router } from 'express';
import ProductRoutes from './products.js';

class Routes {
    constructor() {
        this.router = Router();
        this.handleRoutes();
    }

    handleRoutes() {
        this.router.use('/products', new ProductRoutes().router);
    }
}

export default Routes;
