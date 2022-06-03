import { Schema } from 'mongoose';

const PaymentTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    collection: 'paymentType',
    timestamps: true,
}
);

export { PaymentTypeSchema };