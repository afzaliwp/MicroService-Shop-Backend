import {ProductModel} from '../db/schema/product.js';
import {Types} from 'mongoose';
import {ObjectId} from "mongodb";

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

    update = async (req, res, next) => {
        try {
            const Product = await ProductModel.findById(req.params.id);

            if (!Product) {
                return res.status(404).send({ message: 'Product not found' });
            }

            // Update fields
            Product.title = req.body.title || Product.title;
            Product.slug = req.body.slug || Product.slug;
            Product.price = req.body.price || Product.price;
            Product.quantity = req.body.quantity || Product.quantity;
            Product.updatedAt = new Date();

            // Save the updated product
            const updatedProduct = await Product.save();

            res.json({status: true, ...updatedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            const Product = await ProductModel.findById(req.params.id);

            if (!Product) {
                return res.status(404).json({ status: false, message: 'Product not found.' });
            }

            const deleteResult = await ProductModel.deleteOne({
                _id: req.params.id,
            });


            res.json({status: deleteResult.acknowledged, ...Product._doc});
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