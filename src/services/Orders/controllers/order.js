import {OrderModel} from '../db/schema/order.js';
import {Types} from 'mongoose';
import axios from "axios";
import {grpcPaymentCall} from "../grpc/calls/payment.js";

class OrderController {

    OrderModel;

    grpcPaymentCall;

    constructor() {
        this.OrderModel = OrderModel;
        this.grpcPaymentCall = new grpcPaymentCall();
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
            await this.customerExists(req.body.userId, res);

            req.body.status = Number(req.body.status);
            req.body.items = JSON.parse(req.body.items);

            await this.updateProducts(req.body.items, res);
            req.body.paymentId = await this.createPayment(
                {
                    userId: req.body.userId,
                    amount: req.body.amount
                },
                res
            );

            //With gRPC Call.
            req.body.paymentId = await this.createPaymentGrpc(
                {
                    userId: req.body.userId,
                    amount: req.body.amount
                }
            );
            const newOrder = this.OrderModel(req.body);
            const savedOrder = await newOrder.save();
            res.json({status: true, ...savedOrder._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    addNewGrpc = async (req, res, next) => {
        try {
            await this.customerExists(req.body.userId, res);

            //With gRPC Call.
            req.body.paymentId = await this.createPaymentGrpc(
                {
                    userId: req.body.userId,
                    amount: req.body.amount
                }
            );
            const newOrder = this.OrderModel(req.body);
            const savedOrder = await newOrder.save();
            res.json({status: true, ...savedOrder._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            const Order = await this.orderExists(req.params.id, res);

            // Update fields
            Order.amount = req.body.amount || Order.amount;
            Order.description = req.body.description || Order.description;
            Order.status = req.body.status || Order.status;
            Order.items = req.body.items || Order.items;
            Order.updatedAt = new Date();

            // If order has already a payment id, you can't change it.
            if (!Order.paymentId) {
                Order.paymentId = req.body.paymentId || Order.paymentId;
            }

            // Save the updated Order
            const updatedOrder = await Order.save();

            res.json({status: true, ...updatedOrder._doc});
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
                Order = await this.OrderModel.find({
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

    getOrdersByUserId = async (req, res, next) => {
        try {
            const Order = await this.OrderModel.find({
                userId: new Types.ObjectId(req.params.userId)
            });

            res.json(Order);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async customerExists(userId, res) {
        const {data: userData} = await axios.get(`${process.env.CUSTOMER_SERVICE}/customers/${userId}`);

        if (!userData) {
            return res.status(404).send({message: 'Customer not found!'});
        }

        return userData;
    }

    async orderExists(orderId, res) {
        const Order = await OrderModel.findById(orderId);

        if (!Order) {
            return res.status(404).send({message: 'Order not found!'});
        }

        return Order;
    }

    async updateProducts(items, res) {
        let okToUpdate = [];
        for (const item of items) {
            for (const productId of Object.keys(item)) {
                const {data: product} = await axios.get(`${process.env.CATALOGS_SERVICE}/products/${productId}`);
                const quantity = Number(item[productId]);
                product.quantity = Number(product.quantity);

                if (product.quantity <= 0 || product.quantity < quantity) {
                    okToUpdate = [];
                    return res.status(400).json({
                        success: false,
                        message: `Product ${product.title} has ${product.quantity} items in stock, you asked for ${quantity}.`
                    });
                }

                okToUpdate.push({
                    productId: productId,
                    newQuantity: product.quantity - quantity,
                })
            }
        }
        if (okToUpdate) {
            for (const item of okToUpdate) {
                const {data} = await axios.patch(
                    `${process.env.CATALOGS_SERVICE}/products/update/${item.productId}`,
                    {
                        quantity: item.newQuantity
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
        }
    }

    async createPayment({userId, amount}, res) {
        const {data} = await axios.post(
            `${process.env.PAYMENTS_SERVICE}/payments/new`,
            {
                userId: userId,
                amount: amount,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return data._id;
    }

    async createPaymentGrpc({userId, amount}, res, ) {
        try {
            this.grpcPaymentCall.paymentClient.createPayment({userId, amount}, (error, response) => {
                if (error) {
                    return;
                }

                return response.id;
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                message: 'An unexpected error happened on gRPC server.',
            });
            console.error(e);
        }

    }
}

export {OrderController};