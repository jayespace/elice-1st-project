import { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    address: {
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
    image: {
      type: String,
      required: false,
      default:'https://elice-team12.s3.ap-northeast-2.amazonaws.com/product_dummy/1654062281799.png',
    },
    role: {
      type: String,
      required: false,
      default: 'basic-user',
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

export { UserSchema };
