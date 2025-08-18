import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    register_date: {
        type: Date,
        default: Date.now
    },
});

const Item = models.Item || model('Item', ItemSchema);

export default Item;