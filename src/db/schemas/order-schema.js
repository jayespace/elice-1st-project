import { Schema } from 'mongoose';

const OrderSchema = new Schema({
    user: {
      type: new Schema(
        {
          user_id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
          },
          fullName: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true
          },
          phoneNumber: {
            type: String,
            required: false
          },
        },
        {
          _id: false,
        }
      ),
      requred: true
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
      default: "배송메세지가 없습니다."
    },
      products: {
      type: [new Schema(
        {
          product_id: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
          },
          name: {
            type: String,
            required: false
          },
          qty: {
            type: Number,
            required: true
          },
          totalPrice: {
            type: Number,
            required: false
          },
          image: {
            type: String,
            required: false
          },
        },
        {
          _id: false,
        }
      )],
      requred: true
    },
    deliveryFee: {
      type: Number,
      required: false,
      default: 3000
    },
    paymentMethod: {
      type: String,
      required: false
    },
    orderStatus: {
      type: Schema.Types.ObjectId,
      ref: 'orderStatus',
      required: false,
      default: "629590bf88e88a5137884dd5"
    },
    csStatus: {
      type: Schema.Types.ObjectId,
      ref: 'csStatus',
      required: false,
      default: "62958fdb0408c67d1e8d3653"
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

export { OrderSchema };
