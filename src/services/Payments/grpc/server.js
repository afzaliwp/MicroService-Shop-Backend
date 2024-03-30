import grpc from '@grpc/grpc-js';
import * as grpcLoader from "@grpc/proto-loader";
import {Implementations} from "./implementations/index.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class grpcServer {
    // The gRPC server.
    server;

    constructor() {
        this.server = new grpc.Server();
        const protos = this.handleProto();
        this.addServices(protos);
        this.run();
    }

    run() {
        this.server.bindAsync(process.env.GRPC_URI, grpc.ServerCredentials.createInsecure(), () => {
            console.log(`gRPC server started on ${process.env.GRPC_URI}`)
        });
    }

    handleProto() {
        const PaymentImp = new Implementations();
        const paymentPackageDefinition = grpcLoader.loadSync(resolve(__dirname, '../../../shared/proto/payment.proto'));
        const paymentProto = grpc.loadPackageDefinition(paymentPackageDefinition).microshop.payment;

        return [
            {
                proto: paymentProto,
                service: 'Payment',
                implementation: PaymentImp.createPayment,
                implementationName: 'createPayment',
            }
        ]
    }

    addServices(protos) {
        protos.forEach((protoObj) => {
            this.server.addService(protoObj.proto[protoObj.service].service, {
                [protoObj.implementationName]: protoObj.implementation,
            });
        });
    }
}

export {
    grpcServer,
}