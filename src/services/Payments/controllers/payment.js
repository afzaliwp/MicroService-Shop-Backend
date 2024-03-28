import {PaymentModel} from '../db/schema/payment.js';
import {Types} from 'mongoose';

class PaymentController {

    constructor() {
        this.PaymentModel = PaymentModel;
    }

    getPayments = async (req, res, next) => {
        try {
            const payment = await this.PaymentModel.find();
            res.json(payment);
        } catch (e) {
            console.error(e);
            next();
        }
    }

    addNew = async (req, res, next) => {
        try {
            const newPayment = this.PaymentModel(req.body);
            const savedPayment = await newPayment.save();
            res.json({status: true, ...savedPayment._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            const Payment = await PaymentModel.findById(req.params.id);

            if (!Payment) {
                return res.status(404).send({message: 'Payment not found'});
            }

            // Update fields
            Payment.userId = req.body.userId || Payment.userId;
            Payment.amount = req.body.amount || Payment.amount;
            Payment.description = req.body.description || Payment.description;
            Payment.status = req.body.status || Payment.status;
            Payment.updatedAt = new Date();

            // Save the updated Payment
            const updatedProduct = await Payment.save();

            res.json({status: true, ...updatedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            const Payment = await PaymentModel.findById(req.params.id);

            if (!Payment) {
                return res.status(404).json({status: false, message: 'Payment not found.'});
            }

            const deleteResult = await PaymentModel.deleteOne({
                _id: req.params.id,
            });


            res.json({status: deleteResult.acknowledged, ...Payment._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getPaymentByParam = async (req, res, next) => {
        try {
            let Payment;
            if (Types.ObjectId.isValid(req.params.param)) {
                Payment = await this.PaymentModel.findById(req.params.param);
            } else {
                Payment = await this.PaymentModel.findOne({
                    $or: [
                        {amount: Number(req.params.param)},
                        {status: Number(req.params.param)},
                    ]
                });
            }
            res.json(Payment);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getPaymentByUserId = async (req, res, next) => {
        try {
            const Payment = await this.PaymentModel.findOne({
                userId: new Types.ObjectId(req.params.userId)
            });

            res.json(Payment);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

export {PaymentController};