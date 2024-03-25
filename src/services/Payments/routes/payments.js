import {Router} from 'express';
import {PaymentController} from "../controllers/payment.js";

class PaymentRoutes {

    //Router instance of express.
    router;

    //Product Controller instance.
    Controller;

    constructor() {
        this.router = Router();
        this.Controller = new PaymentController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        const routes = this.getRoutes();

        routes.map( (route) => {
            this.router[route.method](route.path, route.controller);
        } );
    }
    
    getRoutes() {
        return [
            {
                method: 'get',
                path: '/',
                controller: this.Controller.getPayments,
            },
            {
                method: 'get',
                path: '/:param',
                controller: this.Controller.getPaymentByParam,
            },
            {
                method: 'get',
                path: '/user-id/:userId',
                controller: this.Controller.getPaymentByUserId,
            },
            {
                method: 'post',
                path: '/new',
                controller: this.Controller.addNew,
            },
            {
                method: 'patch',
                path: '/update/:id',
                controller: this.Controller.update,
            },
            {
                method: 'delete',
                path: '/delete/:id',
                controller: this.Controller.delete,
            },
        ]
    }
}

export default PaymentRoutes;
