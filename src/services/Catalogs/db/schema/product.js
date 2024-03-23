import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The title field is required!'],
        unique: true
    },
    slug: {
        type: String,
        required: [true, 'The slug field is required!'],
        unique: true
    },
    sku: {
        type: String,
        default: function () {
            return this._id.toHexString();
        },
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
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

productSchema.plugin(uniqueValidator, {message: 'The {PATH} is already used, try another one.'});

const ProductModel = mongoose.model('Product', productSchema);

export {ProductModel};
