import {Router} from 'express';
import {OrderController} from "../controllers/order.js";

class OrderRoutes {

    //Router instance of express.
    router;

    //Product Controller instance.
    Controller;

    constructor() {
        this.router = Router();
        this.Controller = new OrderController();
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
                controller: this.Controller.getOrders,
            },
            {
                method: 'get',
                path: '/:param',
                controller: this.Controller.getOrderByParam,
            },
            {
                method: 'get',
                path: '/user-id/:userId',
                controller: this.Controller.getOrderByUserId,
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

export default OrderRoutes;
