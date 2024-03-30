import {PaymentModel} from '../../db/schema/payment.js';

class Implementations {
    constructor() {
        this.PaymentModel = PaymentModel;
    }

    async createPayment(call, callback) {
        const { userId, amount } = call.request;
        console.log('this.PaymentModel')
        console.log(this.PaymentModel)
        try {
            const newPayment = new this.PaymentModel({ userId, amount });
            const savedPayment = await newPayment.save();
            callback(null, savedPayment._doc._id);
        } catch (e) {
            console.error(e);
            callback(e, null);
        }
    }
}

export {
    Implementations
};