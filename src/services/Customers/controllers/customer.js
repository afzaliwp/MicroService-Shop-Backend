import {CustomerModel} from '../db/schema/customer.js';
import {Types} from 'mongoose';

class CustomerController {

    constructor() {
        this.CustomerModel = CustomerModel;
    }

    getCustomers = async (req, res, next) => {
        try {
            const customer = await this.CustomerModel.find();
            res.json(customer);
        } catch (e) {
            console.error(e);
            next();
        }
    }

    addNew = async (req, res, next) => {
        try {
            const newProduct = this.CustomerModel(req.body);
            newProduct.passwordChanged = true;
            const savedProduct = await newProduct.save();
            res.json({status: true, ...savedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            const Customer = await CustomerModel.findById(req.params.id);

            if (!Customer) {
                return res.status(404).send({ message: 'Customer not found' });
            }

            // Update fields
            Customer.firstName = req.body.firstName || Customer.firstName;
            Customer.lastName = req.body.lastName || Customer.lastName;
            Customer.username = req.body.username || Customer.username;
            Customer.phone = req.body.phone || Customer.phone;
            Customer.email = req.body.email || Customer.email;
            Customer.address = req.body.address || Customer.address;
            Customer.passwordChanged = false;
            Customer.updatedAt = new Date();

            // Save the updated Customer
            const updatedProduct = await Customer.save();

            res.json({status: true, ...updatedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    updatePassword = async (req, res, next) => {
        try {
            const Customer = await CustomerModel.findById(req.params.id);

            if (!Customer) {
                return res.status(404).send({ message: 'Customer not found' });
            }

            // Update fields
            Customer.password = req.body.firstName;
            Customer.passwordChanged = true;
            Customer.updatedAt = new Date();

            // Save the updated Customer
            const updatedProduct = await Customer.save();

            res.json({status: true, ...updatedProduct._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            const Customer = await CustomerModel.findById(req.params.id);

            if (!Customer) {
                return res.status(404).json({ status: false, message: 'Customer not found.' });
            }

            const deleteResult = await CustomerModel.deleteOne({
                _id: req.params.id,
            });


            res.json({status: deleteResult.acknowledged, ...Customer._doc});
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    getCustomerByParam = async (req, res, next) => {
        try {
            let Customer;
            if (Types.ObjectId.isValid(req.params.param)) {
                Customer = await this.CustomerModel.findById(req.params.param);
            } else {
                Customer = await this.CustomerModel.findOne({
                    $or: [
                        {email: req.params.param},
                        {phone: req.params.param},
                        {username: req.params.param},
                    ]
                });
            }
            res.json(Customer);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

export {CustomerController};