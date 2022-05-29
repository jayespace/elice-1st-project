import { Schema } from 'mongoose';

const PaymentStatusSchema = new Schema({
    paymentStatus: {
        type: String,
        required: true
    },
}, {
    collection: 'paymentStatus',
    timestamps: true,
}
);

export { PaymentStatusSchema };