import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import md5 from 'md5';

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'The first name field is required!'],
    },
    lastName: {
        type: String,
        required: [true, 'The last name field is required!'],
    },
    username: {
        type: String,
        required: [true, 'The username field is required!'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'The email field is required!'],
        unique: true,
        validate: {
            validator: function (email) {
                // Regular expression for email validation
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: 'The email is not correct!'
        }
    },
    phone: {
        type: String,
        required: [true, 'The phone number field is required!'],
        unique: true,
        length: [11, 'The phone number should be 11 digits!']
    },
    address: {
        type: String,
    },
    password: {
        type: String,
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

customerSchema.plugin(uniqueValidator, {message: 'The {PATH} is already used, try another one.'});

customerSchema.pre('save', function(next) {
    if ( this.passwordChanged ) {
        this.password = md5(this.password);
    }

    next();
});

const CustomerModel = mongoose.model('Customer', customerSchema);

export {CustomerModel};
