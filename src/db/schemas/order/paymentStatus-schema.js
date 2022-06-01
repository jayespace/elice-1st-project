import { Schema } from 'mongoose';

const PaymentStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    collection: 'paymentStatus',
    timestamps: true,
}
);

export { PaymentStatusSchema };