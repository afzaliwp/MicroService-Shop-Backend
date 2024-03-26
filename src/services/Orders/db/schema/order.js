import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import {ObjectId} from "mongodb";

const STATUSES = {
    PENDING: 0,
    FAILED: 1,
    SUCCEED: 2,
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: [true, 'The user id field is required!'],
    },
    amount: {
        type: Number,
        required: [true, 'The amount field is required!'],
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        min: [0, `select one of these values corresponding to the order status: pending: ${STATUSES.PENDING}, failed: ${STATUSES.FAILED}, succeed: ${STATUSES.SUCCEED}`],
        max: [STATUSES.length, `select one of these values corresponding to the order status: pending: ${STATUSES.PENDING}, failed: ${STATUSES.FAILED}, succeed: ${STATUSES.SUCCEED}`]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.plugin(uniqueValidator, {message: 'The {PATH} is already used, try another one.'});

const OrderModel = mongoose.model('Order', orderSchema);

export {OrderModel};
