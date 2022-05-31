import { Schema } from 'mongoose';

const SystemCodeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
}, {
    collection: 'systemCode',
    timestamps: true,
}
);

export { SystemCodeSchema };