import {OrderModel} from '../db/schema/order.js';
import {Types} from 'mongoose';

class OrderController {

    constructor() {
        this.OrderModel = OrderModel;
    }

    getOrders = async (req, res, next) => {
        try {
            const order = await this.OrderModel.find();
            res.json(order);
        } catch (e) {
            console.error(e);
            next();
        }
    }

    addNew = async (req, res, next) => {
        try {
            const newProduct = this.OrderModel(req.body);
            const savedProduct = await newProduct.save();
            res.json({status: true, ...savedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            const Order = await OrderModel.findById(req.params.id);

            if (!Order) {
                return res.status(404).send({message: 'Order not found'});
            }

            // Update fields
            Order.userId = req.body.userId || Order.userId;
            Order.amount = req.body.amount || Order.amount;
            Order.description = req.body.description || Order.description;
            Order.status = req.body.status || Order.status;
            Order.updatedAt = new Date();

            // Save the updated Order
            const updatedProduct = await Order.save();

            res.json({status: true, ...updatedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            const Order = await OrderModel.findById(req.params.id);

            if (!Order) {
                return res.status(404).json({status: false, message: 'Order not found.'});
            }

            const deleteResult = await OrderModel.deleteOne({
                _id: req.params.id,
            });


            res.json({status: deleteResult.acknowledged, ...Order._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getOrderByParam = async (req, res, next) => {
        try {
            let Order;
            if (Types.ObjectId.isValid(req.params.param)) {
                Order = await this.OrderModel.findById(req.params.param);
            } else {
                Order = await this.OrderModel.findOne({
                    $or: [
                        {amount: Number(req.params.param)},
                        {status: Number(req.params.param)},
                    ]
                });
            }
            res.json(Order);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getOrderByUserId = async (req, res, next) => {
        try {
            const Order = await this.OrderModel.findOne({
                userId: new Types.ObjectId(req.params.userId)
            });

            res.json(Order);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

export {OrderController};