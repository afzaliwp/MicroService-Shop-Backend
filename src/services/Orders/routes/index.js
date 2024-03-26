import { Router } from 'express';
import PaymentRoutes from './payments.js';

class Routes {
    constructor() {
        this.router = Router();
        this.handleRoutes();
    }

    handleRoutes() {
        this.router.use('/payments', new PaymentRoutes().router);
    }
}

export default Routes;
