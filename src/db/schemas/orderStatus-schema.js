import { Schema } from 'mongoose';

const OrderStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    collection: 'orderStatus',
    timestamps: true,
}
);

export { OrderStatusSchema };
