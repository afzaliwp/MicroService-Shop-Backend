import mongoose from "mongoose";

function catchErrorHandler(err, req, res, next) {
    console.error(err);
    let errorMessages = [];

    if (err instanceof mongoose.Error.ValidationError) {
        Object.values(err.errors).map(error => {
            errorMessages.push({
                field: error.path,
                message: error.message,
            });
        });
    } else {
        errorMessages.push({server: 'An unexpected error occurred.'});
    }

    res.send({
        status: false,
        errorMessages
    });
}

export {catchErrorHandler};