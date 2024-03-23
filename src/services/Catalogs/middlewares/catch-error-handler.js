import mongoose from "mongoose";

function catchErrorHandler(err, req, res, next) {
    console.error(err);
    let errorMessage = 'An unexpected error occurred.';

    if (err instanceof mongoose.Error.ValidationError) {
        errorMessage = Object.values(err.errors).map(error => {
            return error.message;
        }).join('<br>');
    }

    res.json({
        status: false,
        message: errorMessage
    });
}

export {catchErrorHandler};