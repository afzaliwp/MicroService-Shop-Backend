import {ProductModel} from '../db/schema/product.js';
import {Types} from 'mongoose';

class ProductController {

    constructor() {
        this.ProductModel = ProductModel;
    }

    getProducts = async (req, res, next) => {
        try {
            const products = await this.ProductModel.find();
            res.json(products);
        } catch (e) {
            console.error(e);
            next();
        }
    }

    addNew = async (req, res, next) => {
        try {
            const newProduct = this.ProductModel(req.body);
            const savedProduct = await newProduct.save();
            res.json({status: true, ...savedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getProductByParam = async (req, res, next) => {
        try {
            let product;
            if (Types.ObjectId.isValid(req.params.param)) {
                product = await this.ProductModel.findById(req.params.param);
            } else {
                product = await this.ProductModel.findOne({
                    $or: [
                        {slug: req.params.param},
                        {sku: req.params.param}
                    ]
                });
            }
            res.json(product);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

export {ProductController};