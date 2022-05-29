import { Schema } from 'mongoose';

const CsStatusSchema = new Schema({
    csStatus: {
        type: String,
        required: true
    },
}, {
    collection: 'csStatus',
    timestamps: true,
}
);

export { CsStatusSchema };