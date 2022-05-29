import { Schema } from 'mongoose';

const PaymentTypeSchema = new Schema({
    paymentMethod: {
        type: String,
        required: true
    },
}, {
    collection: 'paymentType',
    timestamps: true,
}
);

export { PaymentTypeSchema };