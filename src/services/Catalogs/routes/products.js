import {Router} from 'express';
import {ProductController} from "../controllers/product.js";

class ProductRoutes {

    //Router instance of express.
    router;

    //Product Controller instance.
    Controller;

    constructor() {
        this.router = Router();
        this.Controller = new ProductController();
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
                controller: this.Controller.getProducts,
            },
            {
                method: 'get',
                path: '/:param',
                controller: this.Controller.getProductByParam,
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

export default ProductRoutes;
