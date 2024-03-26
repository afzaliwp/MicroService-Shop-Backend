import mongoose, {Types} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const STATUSES = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    FAILED: 3,
    SUCCEED: 4,
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
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
        min: [0, `select one of these values corresponding to the order status: pending: ${STATUSES.PENDING}, failed: ${STATUSES.FAILED}, succeed: ${STATUSES.SUCCEED}, processing: ${STATUSES.PROCESSING}, shipped: ${STATUSES.SHIPPED}`],
        max: [STATUSES.length - 1, `select one of these values corresponding to the order status: pending: ${STATUSES.PENDING}, failed: ${STATUSES.FAILED}, succeed: ${STATUSES.SUCCEED}, processing: ${STATUSES.PROCESSING}, shipped: ${STATUSES.SHIPPED}`]
    },
    paymentId: {
        type: Types.ObjectId, //the Payment id related to this order.
        required: false,
        unique: true,
    },
    items: {
        type: [Types.ObjectId], //an array of the Product ids in the order.
        required: true,
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
