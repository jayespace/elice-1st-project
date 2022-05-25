import { Schema } from 'mongoose';

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    desc: {
        type: String,
        required: true
    },
}, {
    collection: 'products',
    timestamps: true,
}
);

export { ProductSchema };
