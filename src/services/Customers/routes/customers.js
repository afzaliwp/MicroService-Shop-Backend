import {Router} from 'express';
import {CustomerController} from "../controllers/customer.js";

class CustomerRoutes {

    //Router instance of express.
    router;

    //Product Controller instance.
    Controller;

    constructor() {
        this.router = Router();
        this.Controller = new CustomerController();
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
                controller: this.Controller.getCustomers,
            },
            {
                method: 'get',
                path: '/:param',
                controller: this.Controller.getCustomerByParam,
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
                method: 'patch',
                path: '/update-password/:id',
                controller: this.Controller.updatePassword,
            },
            {
                method: 'delete',
                path: '/delete/:id',
                controller: this.Controller.delete,
            },
        ]
    }
}

export default CustomerRoutes;
