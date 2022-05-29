import { Schema } from 'mongoose';

const ProductOptionSchema = new Schema({
    product_Id: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    optionType: {
        type: String,
        required: true
    },
    optionValue: {
        type: [String],
        required: true
    }
}, {
    collection: 'productOption',
    timestamps: true,
}
);

export { ProductOptionSchema };