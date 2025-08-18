import { Schema, model, models } from 'mongoose';

const InventorySchema = new Schema({
    items: [{
        type: Schema.Types.ObjectId, // Define as ObjectId
        ref: 'Item', // Reference the Item model
        required: true,
    }],
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    coins: {
        type: Number,
        required: true,
    }
});

const Inventory = models.Inventory || model('Inventory', InventorySchema);

export default Inventory;