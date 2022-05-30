import { Schema } from 'mongoose';

const OrderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    delivery_fullName: {
        type: String,
        required: true
    },
    delivery_phoneNumber: {
        type: String,
        required: true
    },
    delivery_address: {
        type: new Schema(
          {
            postalCode: String,
            address1: String,
            address2: String,
          },
          {
            _id: false,
          }
        ),
        required: false,
    },
    delivery_message: {
        type: String,
        required: true
    },
    orderedProducts: {
        type: [String],
        requred: true
    },
    paymentMethod: {
        type: String,
        required: false
    }
}, {
    collection: 'orders',
    timestamps: true,
}
);

export { OrderSchema };
