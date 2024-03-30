import grpc from '@grpc/grpc-js';
import * as grpcLoader from "@grpc/proto-loader";
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class grpcPaymentCall {
    paymentClient;

    constructor() {
        const paymentPackageDefinition = grpcLoader.loadSync(resolve(__dirname, '../../../../shared/proto/payment.proto'));
        const paymentProto = grpc.loadPackageDefinition(paymentPackageDefinition).microshop.payment;
        this.paymentClient = new paymentProto.Payment(process.env.PAYMENT_GRPC_URI, grpc.ChannelCredentials.createInsecure());
    }
}

export {
    grpcPaymentCall,
}