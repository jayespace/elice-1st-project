import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    fullNameTo: {
      type: String,
      required: true
    },
    phoneNumberTo: {
      type: String,
      required: true
    },
    addressTo: {
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
    messageTo: {
      type: String,
      required: false,
      default: "배송메세지"
    },
    orderedProducts: {
      type: [String],
      requred: true
    },
    paymentMethod: {
      type: String,
      required: false
    },
    orderStatus: {
      type: Schema.Types.ObjectId,
      ref: 'orderStatus',
      required: false,
      default: "62934a2d1b49d68d742a7dca"
    },
    csStatus: {
      type: Schema.Types.ObjectId,
      ref: 'csStatus',
      required: false,
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

export { OrderSchema };
