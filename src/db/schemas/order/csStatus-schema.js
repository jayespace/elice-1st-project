import { Schema } from 'mongoose';

const CsStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
    collection: 'csStatus',
    timestamps: true,
}
);

export { CsStatusSchema };